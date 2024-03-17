require("dotenv").config();

const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: process.env.DATABASE_PASS,
  port: 5432,
});

module.exports = pool;
