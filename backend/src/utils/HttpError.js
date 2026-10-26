// An error that carries an HTTP status code, so controllers can simply `throw`.
export default class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
