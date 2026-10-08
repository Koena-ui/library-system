import { useState } from "react";
import FormField from "./FormField";

// onProcess({ bookId, type, qty }) returns an error string or null.
export default function TransactionForm({ books, onProcess }) {
  const [bookId, setBookId] = useState("");
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = (type) => {
    setMessage("");
    const n = Number(qty);
    if (!bookId) return setError("Please select a book.");
    if (!Number.isInteger(n) || n < 1) return setError("Quantity must be a whole number of at least 1.");
    const err = onProcess({ bookId, type, qty: n });
    if (err) return setError(err);
    setError("");
    setQty("");
    setMessage(type === "add" ? "Stock added." : "Stock deducted (borrowed).");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <h2>Stock Transaction</h2>
      <FormField as="select" label="Book" name="book" value={bookId} onChange={(e) => setBookId(e.target.value)}>
        <option value="">-- Select a book --</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>{b.title} (in stock: {b.qty})</option>
        ))}
      </FormField>
      <FormField label="Quantity" name="qty" type="number" min="1" value={qty}
        onChange={(e) => setQty(e.target.value)} error={error} />
      {message && <p className="success">{message}</p>}
      <div className="btn-row">
        <button type="button" onClick={() => submit("add")}>Add Stock (Arrival)</button>
        <button type="button" className="danger" onClick={() => submit("deduct")}>Deduct Stock (Borrow)</button>
      </div>
    </form>
  );
}
