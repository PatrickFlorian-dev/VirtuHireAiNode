import express from "express";
import { crudInsert, crudRead, crudUpdate, crudDelete } from "../controllers/crudController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const crudRouter = express.Router();

// ✅ Public Routes (No Authentication Required)
crudRouter.post("/insert", crudInsert, authenticateToken);
crudRouter.post("/read", crudRead, authenticateToken);
crudRouter.post("/update", crudUpdate, authenticateToken);
crudRouter.post("/delete", crudDelete, authenticateToken);

export default crudRouter;
