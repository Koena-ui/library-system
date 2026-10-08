# Hlopheho Community Library (BIWA2110 Individual Assignment 1)

A React library management system. Data is saved in the browser's **localStorage**.

## Run
```
npm install
npm run dev
```
Open the address shown (usually http://localhost:5173).
Default login (first run): membership ID **LIB001** (Librarian).

## Features
- **Dashboard**: card layout of availability, summary stats, search, low-stock highlight (fewer than 2 copies).
- **Manage Books** (librarians): add / update / delete with validation (required fields, 10 or 13 digit unique ISBN, quantity >= 0).
- **Transactions** (librarians): add stock or deduct stock (borrow), blocked if stock is insufficient; full history log.
- **User Management**: login by membership ID; librarians can add / update / delete users.

## React concepts
- Hooks: `useState`, `useEffect` (persistence, form loading, page titles), `useMemo`, `useContext`, custom hooks (`useLocalStorage`, `usePageTitle`)
- Component composition: `components/` (forms, tables, navbar) and `pages/`
- Controlled forms with validation and error messages
- React Router: `BrowserRouter`, `Routes`, `NavLink`, `Navigate`, protected routes
- Context API for shared state (`LibraryContext`, `AuthContext`)

## Structure
```
src/
  main.jsx  App.jsx  styles.css  constants.js
  context/  hooks/  components/  pages/
```

## Push to GitHub
```
git init
git add .
git commit -m "Library management system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
