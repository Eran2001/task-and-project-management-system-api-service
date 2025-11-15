import express from "express";

import { getAllDashboardData } from "@controllers/dashboardController.js";

import verifyToken from "@middlewares/verifyToken.js";

const router = express.Router();

router.get("/get-dashboard", verifyToken, getAllDashboardData);

export default router;
