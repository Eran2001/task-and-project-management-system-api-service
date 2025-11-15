import express from "express";

import {
  registerAdmin,
  verifyAdmin,
} from "@controllers/adminAuthController.js";

const router = express.Router();

router.post("/auth/register", registerAdmin);
router.post("/auth/verify", verifyAdmin);

export default router;
