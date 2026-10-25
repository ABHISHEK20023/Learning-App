import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import app from "./app.js";

async function start() {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
