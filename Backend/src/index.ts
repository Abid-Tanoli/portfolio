import "dotenv/config";
import { app } from "./app.js";
import { connectDb } from "./services/db.js";

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`[portfolio-api] listening on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("[portfolio-api] fatal startup error:", err);
  process.exit(1);
});
