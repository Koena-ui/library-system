import { LOW_STOCK_THRESHOLD } from "../constants";

export default function BookTable({ books, onEdit, onDelete }) {
  if (!books.length) return <p className="empty">No books yet. Add one using the form above.</p>;
  return (
    <div className="table-wrap">
      <table className="responsive-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} className={b.qty < LOW_STOCK_THRESHOLD ? "low-stock" : ""}>
              <td data-label="Title">{b.title}</td>
              <td data-label="Author">{b.author}</td>
              <td data-label="Genre">{b.genre}</td>
              <td data-label="ISBN">{b.isbn}</td>
              <td data-label="Qty">{b.qty}</td>
              <td data-label="Actions" className="actions">
                <button onClick={() => onEdit(b)}>Update</button>
                <button className="danger" onClick={() => onDelete(b)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
