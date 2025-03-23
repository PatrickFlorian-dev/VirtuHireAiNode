import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { sequelize, connectDB } from "./config/db.js";

// Global helper method for console logging with colors 
import consoleLogger from './utils/consoleLogger.js';
global.consoleLogger = consoleLogger;

const app = express();

connectDB();
sequelize.sync({ alter: true }); 

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


