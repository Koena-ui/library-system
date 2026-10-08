import { useState, useEffect } from "react";
import FormField from "./FormField";

const EMPTY = { title: "", author: "", genre: "", isbn: "", qty: "" };
const cleanIsbn = (v) => v.replace(/[-\s]/g, "");

function validate(f, books, editingId) {
  const e = {};
  ["title", "author", "genre"].forEach((k) => { if (!f[k].trim()) e[k] = "This field is required."; });
  const isbn = cleanIsbn(f.isbn);
  if (!/^(\d{10}|\d{13})$/.test(isbn)) e.isbn = "ISBN must be 10 or 13 digits.";
  else if (books.some((b) => b.isbn === isbn && b.id !== editingId)) e.isbn = "A book with this ISBN already exists.";
  if (f.qty === "" || !Number.isInteger(Number(f.qty)) || Number(f.qty) < 0) e.qty = "Enter a whole number, 0 or more.";
  return e;
}

export default function BookForm({ books, editingBook, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editingBook ? { ...editingBook, qty: String(editingBook.qty) } : EMPTY);
    setErrors({});
  }, [editingBook]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, books, editingBook?.id);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: cleanIsbn(form.isbn),
      qty: Number(form.qty),
    });
    setForm(EMPTY);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>{editingBook ? "Update Book" : "Add New Book"}</h2>
      <FormField label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} />
      <FormField label="Author" name="author" value={form.author} onChange={handleChange} error={errors.author} />
      <FormField label="Genre" name="genre" value={form.genre} onChange={handleChange} error={errors.genre} />
      <FormField label="ISBN" name="isbn" value={form.isbn} onChange={handleChange} error={errors.isbn} />
      <FormField label={editingBook ? "Quantity" : "Initial Quantity"} name="qty" type="number" min="0"
        value={form.qty} onChange={handleChange} error={errors.qty} />
      <div className="btn-row">
        <button type="submit">{editingBook ? "Save Changes" : "Add Book"}</button>
        {editingBook && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
