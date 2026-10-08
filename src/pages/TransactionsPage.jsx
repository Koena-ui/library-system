import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import TransactionLog from "../components/TransactionLog";
import usePageTitle from "../hooks/usePageTitle";

export default function TransactionsPage() {
  usePageTitle("Transactions");
  const { books, logs, processTransaction } = useLibrary();
  const { currentUser } = useAuth();

  return (
    <section>
      <TransactionForm books={books} onProcess={(t) => processTransaction({ ...t, by: currentUser.name })} />
      <h2>Transaction History</h2>
      <TransactionLog logs={logs} />
    </section>
  );
}
