import { useMemo, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import { LOW_STOCK_THRESHOLD } from "../constants";
import usePageTitle from "../hooks/usePageTitle";

function BookCard({ book }) {
  const low = book.qty < LOW_STOCK_THRESHOLD;
  return (
    <article className={`card ${low ? "low-stock" : ""}`}>
      <h3>{book.title}</h3>
      <p>{book.author} &middot; {book.genre}</p>
      <p className="muted">ISBN: {book.isbn}</p>
      <p className="qty">
        {book.qty} in stock {low && <strong>{book.qty === 0 ? "(Out of stock)" : "(Low stock)"}</strong>}
      </p>
    </article>
  );
}

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { books } = useLibrary();
  const [search, setSearch] = useState("");

  const stats = useMemo(() => ({
    titles: books.length,
    copies: books.reduce((sum, b) => sum + b.qty, 0),
    low: books.filter((b) => b.qty < LOW_STOCK_THRESHOLD).length,
  }), [books]);

  const visible = books.filter((b) =>
    `${b.title} ${b.author} ${b.genre} ${b.isbn}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <h2>Book Availability</h2>
      <div className="stats">
        <div className="stat"><strong>{stats.titles}</strong> titles</div>
        <div className="stat"><strong>{stats.copies}</strong> copies</div>
        <div className="stat low-stock"><strong>{stats.low}</strong> low stock</div>
      </div>
      <input className="search" type="search" placeholder="Search by title, author, genre or ISBN"
        value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search books" />
      {visible.length ? (
        <div className="cards">{visible.map((b) => <BookCard key={b.id} book={b} />)}</div>
      ) : (
        <p className="empty">{books.length ? "No books match your search." : "No books in the library yet. Log in as a librarian to add some."}</p>
      )}
    </section>
  );
}
