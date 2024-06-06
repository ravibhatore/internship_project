const pool = require('../db/db');

const createUser = async (user) => {
  const { firstname, lastname, email, password } = user;
  const query = `
    INSERT INTO users (firstname, lastname, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [firstname, lastname, email, password];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const savePasswordResetLink = async (email, resetLink, expiry) => {
  const query = `
    UPDATE users
    SET reset_link = $1, reset_link_expiry = $2
    WHERE email = $3
    RETURNING *;
  `;
  const values = [resetLink, expiry, email];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const findUserByResetLink = async (resetLink) => {
  const query = 'SELECT * FROM users WHERE reset_link = $1 AND reset_link_expiry > NOW()';
  const values = [resetLink];
  const res = await pool.query(query, values);
  return res.rows[0];
};

const updatePassword = async (email, newPassword) => {
  const query = `
    UPDATE users
    SET password = $1, reset_link = NULL, reset_link_expiry = NULL
    WHERE email = $2
    RETURNING *;
  `;
  const values = [newPassword, email];
  const res = await pool.query(query, values);
  return res.rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById, savePasswordResetLink, findUserByResetLink, updatePassword };
