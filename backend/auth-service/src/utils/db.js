// Connection-pool helper για PostgreSQL
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_URL            // π.χ. postgres://user:pass@db:5432/clearsky
});
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
