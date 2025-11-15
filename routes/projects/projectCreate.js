import express from "express";

import { createProject } from "@controllers/projectController.js";

import verifyToken from "@middlewares/verifyToken.js";
import { isAdmin } from "@middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create-project", verifyToken, isAdmin, createProject);

export default router;
