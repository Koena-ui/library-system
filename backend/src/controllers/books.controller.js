import { pool } from "../config/db.js";
import HttpError from "../utils/HttpError.js";
import { parseId, validateBook } from "../utils/validate.js";

const COLUMNS = "id, title, author, genre, isbn, qty";

async function findBook(id) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM books WHERE id = ?`, [id]);
  if (!rows.length) throw new HttpError(404, "Book not found.");
  return rows[0];
}

export async function listBooks(req, res) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM books ORDER BY title`);
  res.json(rows);
}

export async function getBook(req, res) {
  res.json(await findBook(parseId(req.params.id)));
}

export async function createBook(req, res) {
  const b = validateBook(req.body);
  const [result] = await pool.query(
    "INSERT INTO books (title, author, genre, isbn, qty) VALUES (?, ?, ?, ?, ?)",
    [b.title, b.author, b.genre, b.isbn, b.qty]
  );
  res.status(201).json(await findBook(result.insertId));
}

export async function updateBook(req, res) {
  const id = parseId(req.params.id);
  const b = validateBook(req.body);
  await findBook(id);
  await pool.query("UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, qty = ? WHERE id = ?", [
    b.title, b.author, b.genre, b.isbn, b.qty, id,
  ]);
  res.json(await findBook(id));
}

export async function deleteBook(req, res) {
  const [result] = await pool.query("DELETE FROM books WHERE id = ?", [parseId(req.params.id)]);
  if (!result.affectedRows) throw new HttpError(404, "Book not found.");
  res.status(204).end();
}
