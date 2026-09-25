import "dotenv/config";

import { app } from "./app.js";
import { ensureAdminUser } from "./modules/auth/ensure-admin.js";

const PORT = Number(process.env.PORT) || 3333;

async function startServer() {
  await ensureAdminUser();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});