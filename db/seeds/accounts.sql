CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    savings DECIMAL,
    checking DECIMAL
);