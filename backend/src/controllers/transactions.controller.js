import { pool } from "../config/db.js";
import HttpError from "../utils/HttpError.js";
import { parseId, parseQuantity } from "../utils/validate.js";

const SELECT = `SELECT id, book_id AS bookId, book_title AS bookTitle, user_id AS userId,
                       user_name AS userName, type, qty, created_at AS createdAt
                FROM transactions`;

export async function listTransactions(req, res) {
  const [rows] = await pool.query(`${SELECT} ORDER BY created_at DESC, id DESC`);
  res.json(rows);
}

// POST /transactions  { bookId, userId, type: "add" | "deduct", qty }
// Runs inside a database transaction and locks the book row, so two requests
// at the same time cannot take the stock below zero.
export async function createTransaction(req, res) {
  const { type } = req.body ?? {};
  if (!["add", "deduct"].includes(type)) throw new HttpError(400, "Type must be 'add' or 'deduct'.");
  const bookId = parseId(req.body.bookId);
  const userId = parseId(req.body.userId);
  const qty = parseQuantity(req.body.qty, { min: 1 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [books] = await conn.query("SELECT id, title, qty FROM books WHERE id = ? FOR UPDATE", [bookId]);
    if (!books.length) throw new HttpError(404, "Book not found.");
    const book = books[0];
    if (type === "deduct" && book.qty < qty)
      throw new HttpError(400, `Insufficient stock: only ${book.qty} available.`);

    const [users] = await conn.query("SELECT id, name FROM users WHERE id = ?", [userId]);
    if (!users.length) throw new HttpError(404, "User not found.");

    const newQty = type === "add" ? book.qty + qty : book.qty - qty;
    await conn.query("UPDATE books SET qty = ? WHERE id = ?", [newQty, bookId]);
    const [result] = await conn.query(
      "INSERT INTO transactions (book_id, book_title, user_id, user_name, type, qty) VALUES (?, ?, ?, ?, ?, ?)",
      [bookId, book.title, userId, users[0].name, type, qty]
    );
    await conn.commit();

    const [[transaction]] = await pool.query(`${SELECT} WHERE id = ?`, [result.insertId]);
    const [[updatedBook]] = await pool.query("SELECT id, title, author, genre, isbn, qty FROM books WHERE id = ?", [bookId]);
    res.status(201).json({ transaction, book: updatedBook });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
