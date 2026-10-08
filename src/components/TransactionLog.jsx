export default function TransactionLog({ logs }) {
  if (!logs.length) return <p className="empty">No transactions recorded yet.</p>;
  return (
    <div className="table-wrap">
      <table className="responsive-table">
        <thead><tr><th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>By</th></tr></thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td data-label="Date">{new Date(l.date).toLocaleString()}</td>
              <td data-label="Book">{l.bookTitle}</td>
              <td data-label="Type">{l.type === "add" ? "Added" : "Borrowed"}</td>
              <td data-label="Qty">{l.qty}</td>
              <td data-label="By">{l.by}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
