const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create a Pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password123',
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 2. Automated table creation logic
const initDb = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )`;
  
  pool.query(createTableQuery, (err) => {
    if (err) {
      console.error("Database not ready yet, retrying in 5 seconds...");
      setTimeout(initDb, 5000); // Retry until DB is alive
    } else {
      console.log("Connected to MySQL and 'users' table is ready!");
    }
  });
};

initDb();

app.get("/", (req, res) => res.send("Backend is up and healthy!"));

// 3. Update routes to use pool.query
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message, fatal: err.fatal });
    res.json(results);
  });
});

app.post("/users", (req, res) => {
  const { name } = req.body;
  pool.query("INSERT INTO users (name) VALUES (?)", [name], (err) => {
    if (err) return res.status(500).json({ error: err.message, fatal: err.fatal });
    res.json({ message: "User added" });
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
