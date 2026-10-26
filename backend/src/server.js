import "dotenv/config";
import app from "./app.js";
import { initDb } from "./db/init.js";

const PORT = process.env.PORT || 5000;

try {
  await initDb();
  app.listen(PORT, () => console.log(`Library API running at http://localhost:${PORT}/api`));
} catch (err) {
  console.error("Could not start: database connection or setup failed.");
  console.error(err.message);
  console.error("Check that MySQL is running and that the values in backend/.env are correct.");
  process.exit(1);
}
