import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import BookForm from "../components/BookForm";
import BookTable from "../components/BookTable";
import usePageTitle from "../hooks/usePageTitle";

export default function BooksPage() {
  usePageTitle("Manage Books");
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editing, setEditing] = useState(null);

  // Returns an error message (shown in the form) or null on success.
  const handleSubmit = async (data) => {
    if (!editing) return addBook(data);
    const err = await updateBook(editing.id, data);
    if (!err) setEditing(null);
    return err;
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    const err = await deleteBook(book.id);
    if (err) return alert(err);
    if (editing?.id === book.id) setEditing(null);
  };

  return (
    <section>
      <BookForm books={books} editingBook={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      <h2>Book Catalog</h2>
      <BookTable books={books} onEdit={setEditing} onDelete={handleDelete} />
    </section>
  );
}
