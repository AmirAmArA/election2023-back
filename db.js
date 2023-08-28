const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  charset: "utf8mb4",
  waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});


module.exports = db;

