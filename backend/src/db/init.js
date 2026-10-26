import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import { dbConfig, DB_NAME, pool } from "../config/db.js";

const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));

// Creates the database and tables if they do not exist, and adds a default librarian.
export async function initDb() {
  const admin = await mysql.createConnection(dbConfig);
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4`);
  await admin.end();

  const statements = readFileSync(schemaPath, "utf8")
    .replace(/--.*$/gm, "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) await pool.query(sql);

  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM users");
  if (total === 0) {
    await pool.query("INSERT INTO users (name, membership_id, role) VALUES (?, ?, ?)", [
      "Head Librarian",
      "LIB001",
      "Librarian",
    ]);
    console.log("Created default librarian (membership ID: LIB001)");
  }
}

// Allow `npm run db:init` to run this file directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDb()
    .then(() => { console.log(`Database "${DB_NAME}" is ready.`); return pool.end(); })
    .catch((err) => { console.error("Database setup failed:", err.message); process.exit(1); });
}
