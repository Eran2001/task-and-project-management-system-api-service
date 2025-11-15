import express from "express";

import { registerAdmin } from "@controllers/authController.js";

const router = express.Router();

router.post("/auth/register", registerAdmin);

export default router;
