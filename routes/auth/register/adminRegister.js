import express from "express";

import { registerAdmin } from "@controllers/adminAuthController.js";

const userRegisterRoutes = express.Router();

userRegisterRoutes.post("/auth/register", registerAdmin);

export default userRegisterRoutes;
