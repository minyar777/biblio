-- Library database structure
CREATE TABLE categorie(
   id VARCHAR(50),
   name VARCHAR(50),
   description VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE books(
   id INT,
   title VARCHAR(50),
   isbn VARCHAR(50),
   publication_year VARCHAR(4),
   available BOOLEAN,
   PRIMARY KEY(id)
);

CREATE TABLE author(
   id INT,
   first_name VARCHAR(50),
   last_name VARCHAR(50),
   nationality VARCHAR(50),
   PRIMARY KEY(id)
);

CREATE TABLE members(
   id VARCHAR(50),
   first_name VARCHAR(50),
   last_name VARCHAR(50),
   email VARCHAR(50),
   registration_date DATE,
   PRIMARY KEY(id)
);

CREATE TABLE write(
   id INT,
   id_1 INT,
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES books(id),
   FOREIGN KEY(id_1) REFERENCES author(id)
);

CREATE TABLE avoir(
   id VARCHAR(50),
   id_1 INT,
   PRIMARY KEY(id, id_1),
   FOREIGN KEY(id) REFERENCES categorie(id),
   FOREIGN KEY(id_1) REFERENCES books(id)
);

CREATE TABLE loan(
   id INT,
   id_1 VARCHAR(50),
   loan_date DATE,
   return_date DATE,
   PRIMARY KEY(id, id_1, loan_date),
   FOREIGN KEY(id) REFERENCES books(id),
   FOREIGN KEY(id_1) REFERENCES members(id)
);
