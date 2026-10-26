export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler: turns thrown errors into JSON responses.
export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body." });

  if (err.code === "ER_DUP_ENTRY") {
    const what = /isbn/i.test(err.message) ? "A book with this ISBN already exists." : "This membership ID is already taken.";
    return res.status(409).json({ message: what });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? "Something went wrong on the server." : err.message });
}
