const mysql = require("mysql2");
const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database,
  charset: "utf8mb4",
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
  const formattedDate = currentDate.toISOString().slice(0, 10); // Format to 'YYYY-MM-DD'
  console.log(formattedDate);
  console.log("Connected to MySQL database");
});
module.exports = db;
