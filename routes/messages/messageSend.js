import express from "express";

import { sendMessage } from "@controllers/messageController.js";

import verifyToken from "@middlewares/verifyToken.js";

const router = express.Router();

router.post("/send-message", verifyToken, sendMessage);

export default router;
