import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies (important for authentication)
  })
);

const SECRET = process.env.JWT_SECRET || "your_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your_refresh_secret";

let users = []; // ✅ Fix: Define users array
let refreshTokens = []; // ✅ Refresh token storage

// ✅ Register Endpoint
app.post("/api/auth/register", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, password: hashedPassword };

  users.push(user);
  res.json({ message: "User registered successfully" });
});

// ✅ Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ✅ Protected Route Example
app.get("/api/auth/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is a protected route!` });
});

// ✅ Login Endpoint
app.post("/api/auth/login", (req, res) => {
  const { name, password } = req.body;
  const user = users.find((u) => u.name === name);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ id: user.id, name: user.name }, SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user.id, name: user.name }, REFRESH_SECRET);

  refreshTokens.push(refreshToken);
  res.cookie("refreshToken", refreshToken, { httpOnly: true });

  res.json({ token: accessToken, user: { id: user.id, name: user.name } });
});

// ✅ Refresh Token Endpoint
app.post("/api/auth/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: user.id, name: user.name }, SECRET, {
      expiresIn: "15m",
    });

    res.json({ token: accessToken });
  });
});

// ✅ Logout Endpoint
app.post("/api/auth/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(400).json({ message: "No token provided" });

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.clearCookie("refreshToken");

  res.json({ message: "User logged out successfully" });
});

// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
