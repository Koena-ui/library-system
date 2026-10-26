# Hlopheho Community Library (BIWA2110)

A full-stack library management system.

- **frontend/** React (Vite), React Router, hooks, controlled forms, Fetch API
- **backend/** Express REST API with MySQL (`mysql2`), `express.json()` and `cors` middleware

```
React  --fetch-->  Express API (/api/books, /api/transactions, /api/users)  -->  MySQL
```

## 1. Requirements
- Node.js 18 or newer
- MySQL (for example XAMPP: start **MySQL** in the XAMPP Control Panel)

## 2. Run the backend
```
cd backend
npm install
```
Open `backend/.env` and check the database settings (XAMPP default is user `root` with an empty password). If `.env` is missing, copy `.env.example` to `.env`.
```
npm start
```
The API creates the `library_db` database, the tables and a default librarian automatically.
You should see: `Library API running at http://localhost:5000/api`

## 3. Run the frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 and log in with membership ID **LIB001** (User Management page).

## REST API

| Method | Route | Purpose |
|---|---|---|
| GET | /api/books | List books |
| GET | /api/books/:id | One book |
| POST | /api/books | Add a book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| GET | /api/transactions | Transaction history |
| POST | /api/transactions | Add or deduct stock `{ bookId, userId, type: "add" or "deduct", qty }` |
| GET | /api/users | List users |
| POST | /api/users | Add a user |
| PUT | /api/users/:id | Update a user |
| DELETE | /api/users/:id | Delete a user |
| POST | /api/users/login | Login with `{ membershipId }` |

Rules enforced by the server: required fields, 10 or 13 digit unique ISBN, quantity >= 0, unique membership ID,
stock can never go below zero (checked inside a database transaction), and the last librarian cannot be deleted or demoted.
Transaction history keeps the book title and user name, so it survives if the book or user is later deleted.

## Database tables
`books`, `users`, `transactions` (see `backend/src/db/schema.sql`).

## Project structure
```
backend/src/   app.js  server.js  config/  db/  routes/  controllers/  middleware/  utils/
frontend/src/  main.jsx  App.jsx  api/  context/  hooks/  components/  pages/
```

## Notes
- Login is simplified (membership ID only, no password or token), as the brief describes.
- Hosting: GitHub Pages can host only the **frontend**. The backend and MySQL need a Node host.
  To show the live site, set `VITE_API_URL` in `frontend/.env` to the hosted API address, then run `npm run deploy` in `frontend/`.
  Otherwise demonstrate the project by running both parts locally.
