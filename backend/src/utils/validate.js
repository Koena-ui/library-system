import HttpError from "./HttpError.js";

const text = (value, label, max) => {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) throw new HttpError(400, `${label} is required.`);
  if (v.length > max) throw new HttpError(400, `${label} must be at most ${max} characters.`);
  return v;
};

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Invalid id.");
  return id;
}

export function parseQuantity(value, { min }) {
  const n = Number(value);
  if (value === "" || value === null || value === undefined || !Number.isInteger(n) || n < min)
    throw new HttpError(400, `Quantity must be a whole number of ${min} or more.`);
  return n;
}

export function validateBook(body = {}) {
  const isbn = String(body.isbn ?? "").replace(/[-\s]/g, "");
  if (!/^(\d{10}|\d{13})$/.test(isbn)) throw new HttpError(400, "ISBN must be 10 or 13 digits.");
  return {
    title: text(body.title, "Title", 200),
    author: text(body.author, "Author", 150),
    genre: text(body.genre, "Genre", 100),
    isbn,
    qty: parseQuantity(body.qty, { min: 0 }),
  };
}

export function validateUser(body = {}) {
  const name = text(body.name, "Name", 100);
  if (name.length < 2) throw new HttpError(400, "Name must be at least 2 characters.");
  if (!["Librarian", "Member"].includes(body.role)) throw new HttpError(400, "Role must be Librarian or Member.");
  return { name, membershipId: text(body.membershipId, "Membership ID", 50), role: body.role };
}
