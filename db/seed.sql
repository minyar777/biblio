-- Sample data (run after structure/schema.sql)
INSERT INTO categorie (id, name, description) VALUES
('C1', 'Fiction', 'Novels and short stories'),
('C2', 'Science', 'Science and technology'),
('C3', 'History', 'Historical works'),
('C4', 'Fantasy', 'Fantasy and adventure');

INSERT INTO author (id, first_name, last_name, nationality) VALUES
(1, 'Albert', 'Camus', 'French'),
(2, 'Naguib', 'Mahfouz', 'Egyptian'),
(3, 'Carl', 'Sagan', 'American'),
(4, 'J.R.R.', 'Tolkien', 'British'),
(5, 'Yuval Noah', 'Harari', 'Israeli');

INSERT INTO books (id, title, isbn, publication_year, available) VALUES
(1, 'The Stranger', '978-0679720201', '1942', TRUE),
(2, 'Cairo Trilogy', '978-0385264662', '1956', FALSE),
(3, 'Cosmos', '978-0345539434', '1980', TRUE),
(4, 'The Hobbit', '978-0547928227', '1937', FALSE),
(5, 'Sapiens', '978-0062316110', '2011', TRUE),
(6, 'The Plague', '978-0679720218', '1947', TRUE);

INSERT INTO members (id, first_name, last_name, email, registration_date) VALUES
('M1', 'Amine', 'Ben Salah', 'amine@example.com', '2025-01-15'),
('M2', 'Sarra', 'Trabelsi', 'sarra@example.com', '2025-03-02'),
('M3', 'Youssef', 'Gharbi', 'youssef@example.com', '2025-06-20'),
('M4', 'Lina', 'Mansour', 'lina@example.com', '2026-02-10');

INSERT INTO write (id, id_1) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 1);

INSERT INTO avoir (id, id_1) VALUES
('C1', 1), ('C1', 2), ('C2', 3), ('C4', 4), ('C3', 5), ('C1', 6);

INSERT INTO loan (id, id_1, loan_date, return_date) VALUES
(2, 'M1', '2026-09-20', NULL),
(4, 'M2', '2026-09-25', NULL),
(1, 'M3', '2026-08-01', '2026-08-15'),
(3, 'M1', '2026-07-10', '2026-07-24'),
(5, 'M4', '2026-09-01', '2026-09-14');
