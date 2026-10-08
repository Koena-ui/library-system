import { useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import BookForm from "../components/BookForm";
import BookTable from "../components/BookTable";
import usePageTitle from "../hooks/usePageTitle";

export default function BooksPage() {
  usePageTitle("Manage Books");
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [editing, setEditing] = useState(null);

  const handleSubmit = (data) => {
    if (editing) {
      updateBook(editing.id, data);
      setEditing(null);
    } else {
      addBook(data);
    }
  };

  const handleDelete = (book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    deleteBook(book.id);
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
