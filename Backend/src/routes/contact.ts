import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { asyncHandler } from "./_helpers.js";
import { sendContactEmail } from "../services/mailer.js";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export const contactRouter = Router();

const WINDOW_MS = 15 * 60_000;
const MAX_PER_IP = 10;
const hits = new Map<string, { count: number; windowStart: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? "unknown";
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return next();
  }
  if (entry.count >= MAX_PER_IP) {
    res.status(429).json({ error: "Too many messages. Please wait a few minutes and try again." });
    return;
  }
  entry.count += 1;
  return next();
}

contactRouter.post(
  "/",
  rateLimit,
  asyncHandler(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      res.status(400).json({ error: "Validation failed", issues });
      return;
    }

    const { name, email, subject, message } = parsed.data;

    let emailSent = false;
    let messageId: string | null = null;

    if (isContactConfigured()) {
      try {
        const info = await sendContactEmail({ name, email, subject, message });
        emailSent = true;
        messageId = info.messageId ?? null;
      } catch (err) {
        console.warn("[contact] SMTP send failed:", err);
      }
    }

    // Attempt to persist the submission to the database.
    // If this fails, we still acknowledge receipt to the visitor but clearly flag
    // the failure in server logs and in the response body (saved: false).
    let saved = false;
    try {
      const { ContactSubmission } = await import("../models/ContactSubmission.js");
      await ContactSubmission.create({
        name,
        email,
        message: subject ? `Subject: ${subject}\n\n${message}` : message,
        submittedAt: new Date(),
        read: false,
      });
      saved = true;
    } catch (err) {
      // Upgraded from console.warn so this appears in standard error log monitoring.
      console.error(
        "[contact] DB write failed — submission was NOT persisted to the database. " +
          "Check MongoDB connectivity (GET /api/health -> db field). Error:",
        err
      );
    }

    if (!emailSent && !isContactConfigured()) {
      res.status(200).json({
        ok: true,
        saved,
        note: "Message received. SMTP email delivery pending configuration.",
      });
      return;
    }

    res.status(200).json({ ok: true, saved, messageId });
  })
);

export { contactSchema };

export function isContactConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
