const mysql = require("mysql2");
const fs = require('fs');

console.log('Config:', {
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port
});

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca-certificate.crt') // Adjust the path accordingly
  }
});


module.exports = db;

