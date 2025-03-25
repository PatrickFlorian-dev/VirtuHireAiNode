import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import { sequelize, connectDB } from "./config/db.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js'
import crudRouter from './routes/crudRoutes.js';
import compression from 'compression';

// Global helper method for console logging with colors 
import consoleLogger from './utils/consoleLogger.js';
global.consoleLogger = consoleLogger;

const app = express();

connectDB();
await sequelize.sync({ force: false, alter: false, logging: false });

app.use(express.json());
app.use(cookieParser());

app.use(compression());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/crud", crudRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});


