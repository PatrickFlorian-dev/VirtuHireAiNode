require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = []; // Temporary storage

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Register Endpoint
app.post("/api/register", async (req, res) => {
  const { name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, password: hashedPassword };
  users.push(user);
  res.json({ message: "User registered successfully" });
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => u.name === name);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name } });
});

// Protected Route Example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is a protected route!` });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
