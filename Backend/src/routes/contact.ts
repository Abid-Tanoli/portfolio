import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "./_helpers.js";
import { sendContactEmail } from "../services/mailer.js";
import { getDb } from "../services/db.js";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(160),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

export const contactRouter = Router();

contactRouter.post(
  "/",
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

    if (!isContactConfigured()) {
      res.status(503).json({
        error:
          "Mail server is not configured yet. Add SMTP credentials to the backend .env file (see .env.example).",
      });
      return;
    }

    const info = await sendContactEmail({ name, email, subject, message });

    const db = getDb();
    if (db) {
      await db.collection("contact_messages").insertOne({
        name,
        email,
        subject,
        message,
        sent: true,
        messageId: info.messageId ?? null,
        createdAt: new Date(),
      });
    }

    res.status(200).json({ ok: true, messageId: info.messageId ?? null });
  })
);

export { contactSchema };

export function isContactConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
