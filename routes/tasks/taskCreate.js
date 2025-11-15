import express from "express";

import { createTask, updateTask } from "@controllers/taskController.js";

import verifyToken from "@middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-task", verifyToken, createTask);

router.put("/update-task/:id", verifyToken, updateTask);

export default router;
