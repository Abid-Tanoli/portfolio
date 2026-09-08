/**
 * seed-projects.ts
 *
 * One-off script that upserts all 8 portfolio projects from the fallback
 * array into MongoDB so every document has a real Mongoose ObjectId.
 *
 * Safe to run multiple times — uses `upsert` keyed on `slug`.
 *
 * Usage (from the Backend directory):
 *   npx tsx src/scripts/seed-projects.ts
 *
 * Requires MONGO_URI to be set in .env (or environment).
 */

import "dotenv/config";
import mongoose from "mongoose";
import { connectDb, isDbConnected } from "../services/db.js";
import { Project } from "../models/Project.js";
import { fallbackProjects } from "../routes/projects.js";

async function seed() {
  await connectDb();

  if (!isDbConnected()) {
    console.error(
      "[seed-projects] Could not connect to MongoDB. " +
        "Check MONGO_URI in your .env and that the Atlas IP allowlist includes this machine."
    );
    process.exit(1);
  }

  console.log(`[seed-projects] Connected. Upserting ${fallbackProjects.length} projects...`);

  let created = 0;
  let updated = 0;

  for (const data of fallbackProjects) {
    const result = await Project.findOneAndUpdate(
      { slug: data.slug },
      { $setOnInsert: data }, // only set fields when inserting — don't overwrite manual edits
      { upsert: true, new: true, rawResult: true }
    );

    // Mongoose rawResult: lastErrorObject.updatedExisting is true when the doc already existed
    if ((result as any).lastErrorObject?.updatedExisting) {
      updated++;
      console.log(`  [skip]   ${data.slug} — already exists`);
    } else {
      created++;
      console.log(`  [create] ${data.slug} — inserted with _id ${(result as any).value?._id}`);
    }
  }

  console.log(`\n[seed-projects] Done. Created: ${created}, Already existed: ${updated}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[seed-projects] Fatal error:", err);
  process.exit(1);
});
