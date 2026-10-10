import { query, withTransaction } from "./db.js";

// ---------- Books ----------

export async function getAllBooks() {
  const { rows } = await query("SELECT * FROM books ORDER BY title");
  return rows;
}

export async function getAvailableBooks() {
  const { rows } = await query(
    "SELECT * FROM books WHERE available = TRUE ORDER BY title"
  );
  return rows;
}

// Books with their authors and categories
export async function getBooksWithDetails() {
  const { rows } = await query(`
    SELECT b.id, b.title, b.isbn, b.publication_year, b.available,
           a.first_name || ' ' || a.last_name AS author,
           c.name AS category
    FROM books b
    LEFT JOIN "write" w ON w.id = b.id
    LEFT JOIN author a ON a.id = w.id_1
    LEFT JOIN avoir av ON av.id_1 = b.id
    LEFT JOIN categorie c ON c.id = av.id
    ORDER BY b.title
  `);
  return rows;
}

export async function searchBooks(term) {
  const { rows } = await query(
    "SELECT * FROM books WHERE title ILIKE $1 OR isbn ILIKE $1 ORDER BY title",
    [`%${term}%`]
  );
  return rows;
}

export async function getBooksByCategory(categoryId) {
  const { rows } = await query(
    `SELECT b.* FROM books b
     JOIN avoir av ON av.id_1 = b.id
     WHERE av.id = $1
     ORDER BY b.title`,
    [categoryId]
  );
  return rows;
}

export async function getBooksByAuthor(authorId) {
  const { rows } = await query(
    `SELECT b.* FROM books b
     JOIN "write" w ON w.id = b.id
     WHERE w.id_1 = $1
     ORDER BY b.publication_year`,
    [authorId]
  );
  return rows;
}

// ---------- Members ----------

export async function getAllMembers() {
  const { rows } = await query("SELECT * FROM members ORDER BY last_name");
  return rows;
}

export async function addMember({ id, first_name, last_name, email }) {
  const { rows } = await query(
    `INSERT INTO members (id, first_name, last_name, email, registration_date)
     VALUES ($1, $2, $3, $4, CURRENT_DATE)
     RETURNING *`,
    [id, first_name, last_name, email]
  );
  return rows[0];
}

// ---------- Loans ----------

// Loans not yet returned
export async function getActiveLoans() {
  const { rows } = await query(`
    SELECT l.loan_date, b.title,
           m.first_name || ' ' || m.last_name AS member
    FROM loan l
    JOIN books b ON b.id = l.id
    JOIN members m ON m.id = l.id_1
    WHERE l.return_date IS NULL
    ORDER BY l.loan_date
  `);
  return rows;
}

export async function getMemberLoans(memberId) {
  const { rows } = await query(
    `SELECT l.loan_date, l.return_date, b.title
     FROM loan l
     JOIN books b ON b.id = l.id
     WHERE l.id_1 = $1
     ORDER BY l.loan_date DESC`,
    [memberId]
  );
  return rows;
}

// Borrow a book: checks availability, creates the loan, marks the book unavailable
export async function borrowBook(bookId, memberId) {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      "SELECT available FROM books WHERE id = $1 FOR UPDATE",
      [bookId]
    );
    if (rows.length === 0) throw new Error(`Book ${bookId} not found`);
    if (!rows[0].available) throw new Error(`Book ${bookId} is already on loan`);

    await client.query(
      "INSERT INTO loan (id, id_1, loan_date) VALUES ($1, $2, CURRENT_DATE)",
      [bookId, memberId]
    );
    await client.query("UPDATE books SET available = FALSE WHERE id = $1", [
      bookId,
    ]);
  });
}

// Return a book: sets the return date and marks the book available again
export async function returnBook(bookId, memberId) {
  return withTransaction(async (client) => {
    const { rowCount } = await client.query(
      `UPDATE loan SET return_date = CURRENT_DATE
       WHERE id = $1 AND id_1 = $2 AND return_date IS NULL`,
      [bookId, memberId]
    );
    if (rowCount === 0) throw new Error("No active loan found for this book and member");

    await client.query("UPDATE books SET available = TRUE WHERE id = $1", [
      bookId,
    ]);
  });
}

// ---------- Stats ----------

export async function getLoanCountPerBook() {
  const { rows } = await query(`
    SELECT b.title, COUNT(l.id) AS loans
    FROM books b
    LEFT JOIN loan l ON l.id = b.id
    GROUP BY b.id, b.title
    ORDER BY loans DESC, b.title
  `);
  return rows;
}
