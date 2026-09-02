import "dotenv/config";
import { app } from "./app.js";
import { connectDb, isDbConnected } from "./services/db.js";

import bcrypt from "bcrypt";
import { Admin } from "./models/Admin.js";

const PORT = Number(process.env.PORT) || 4000;

async function ensureAdmin() {
  if (!isDbConnected()) {
    console.log("[portfolio-api] DB not connected, skipping ensureAdmin");
    return;
  }

  const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      "[portfolio-api] ADMIN_INITIAL_EMAIL and/or ADMIN_INITIAL_PASSWORD not set — skipping admin seed. " +
      "Set both env vars to create/reset the admin account on first run."
    );
    return;
  }

  try {
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      await Admin.create({ email: adminEmail, passwordHash });
      console.log(`[portfolio-api] Initial Admin account created: ${adminEmail}`);
    } else {
      // Ensure password matches ADMIN_INITIAL_PASSWORD if provided
      const matches = await bcrypt.compare(adminPassword, admin.passwordHash);
      if (!matches) {
        const salt = await bcrypt.genSalt(10);
        admin.passwordHash = await bcrypt.hash(adminPassword, salt);
        await admin.save();
        console.log(`[portfolio-api] Admin password synchronized for ${adminEmail}`);
      }
    }
  } catch (err) {
    console.warn("[portfolio-api] Admin ensure skipped/failed:", err);
  }
}

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    console.error("[portfolio-api] JWT_SECRET is not set — refusing to start");
    process.exit(1);
  }

  await connectDb();
  await ensureAdmin();
  app.listen(PORT, () => {
    console.log(`[portfolio-api] listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("[portfolio-api] fatal startup error:", err);
  process.exit(1);
});
