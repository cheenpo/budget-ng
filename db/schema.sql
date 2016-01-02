CREATE TABLE budget
(
 hash TEXT primary key not null,
 year INTEGER,
 month INTEGER,
 day INTEGER,
 amount DECIMAL(20,2),
 description TEXT,
 account TEXT,
 ignore BOOLEAN,
 macro TEXT,
 micro TEXT
);
