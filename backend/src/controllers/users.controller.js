import { pool } from "../config/db.js";
import HttpError from "../utils/HttpError.js";
import { parseId, validateUser } from "../utils/validate.js";

const SELECT = "SELECT id, name, membership_id AS membershipId, role FROM users";

async function findUser(id) {
  const [rows] = await pool.query(`${SELECT} WHERE id = ?`, [id]);
  if (!rows.length) throw new HttpError(404, "User not found.");
  return rows[0];
}

async function countLibrarians() {
  const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'Librarian'");
  return total;
}

export async function listUsers(req, res) {
  const [rows] = await pool.query(`${SELECT} ORDER BY name`);
  res.json(rows);
}

export async function createUser(req, res) {
  const u = validateUser(req.body);
  const [result] = await pool.query("INSERT INTO users (name, membership_id, role) VALUES (?, ?, ?)", [
    u.name, u.membershipId, u.role,
  ]);
  res.status(201).json(await findUser(result.insertId));
}

export async function updateUser(req, res) {
  const id = parseId(req.params.id);
  const u = validateUser(req.body);
  const existing = await findUser(id);
  if (existing.role === "Librarian" && u.role !== "Librarian" && (await countLibrarians()) === 1)
    throw new HttpError(409, "There must be at least one librarian.");
  await pool.query("UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?", [
    u.name, u.membershipId, u.role, id,
  ]);
  res.json(await findUser(id));
}

export async function deleteUser(req, res) {
  const id = parseId(req.params.id);
  const existing = await findUser(id);
  if (existing.role === "Librarian" && (await countLibrarians()) === 1)
    throw new HttpError(409, "You cannot delete the last librarian.");
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
  res.status(204).end();
}

// POST /users/login  { membershipId }
export async function login(req, res) {
  const membershipId = String(req.body?.membershipId ?? "").trim();
  if (!membershipId) throw new HttpError(400, "Membership ID is required.");
  const [rows] = await pool.query(`${SELECT} WHERE membership_id = ?`, [membershipId]);
  if (!rows.length) throw new HttpError(401, "Membership ID not found.");
  res.json(rows[0]);
}
