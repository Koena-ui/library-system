-- Hlopheho Community Library schema (MySQL / MariaDB)

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  membership_id VARCHAR(50)  NOT NULL UNIQUE,
  role          ENUM('Librarian', 'Member') NOT NULL DEFAULT 'Member',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS books (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  author     VARCHAR(150) NOT NULL,
  genre      VARCHAR(100) NOT NULL,
  isbn       VARCHAR(13)  NOT NULL UNIQUE,
  qty        INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_books_qty CHECK (qty >= 0)
) ENGINE=InnoDB;

-- Borrowing / stock history. The book title and user name are copied in, and the
-- foreign keys use SET NULL, so history is kept even after a book or user is deleted.
CREATE TABLE IF NOT EXISTS transactions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  book_id    INT NULL,
  book_title VARCHAR(200) NOT NULL,
  user_id    INT NULL,
  user_name  VARCHAR(100) NOT NULL,
  type       ENUM('add', 'deduct') NOT NULL,
  qty        INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_tx_qty CHECK (qty > 0),
  CONSTRAINT fk_tx_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
  CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
