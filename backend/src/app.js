import express from "express";
import cors from "cors";
import booksRoutes from "./routes/books.routes.js";
import usersRoutes from "./routes/users.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
const origins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim());
app.use(cors({ origin: origins?.length ? origins : true })); // cross-origin requests from the React app
app.use(express.json());                                      // parse JSON request bodies

// Routes
app.get("/api", (req, res) => res.json({ status: "ok", service: "Hlopheho Community Library API" }));
app.use("/api/books", booksRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/users", usersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
