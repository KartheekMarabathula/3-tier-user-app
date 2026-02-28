const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "testdb"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/users", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO users (name) VALUES (?)", [name], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User added" });
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});