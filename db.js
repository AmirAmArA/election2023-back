const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  charset: "utf8mb4",
  connectionLimit: 10 // Adjust as needed
});

db.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

module.exports = db;

