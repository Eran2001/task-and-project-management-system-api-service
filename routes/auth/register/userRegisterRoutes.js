import express from "express";

import { registerUser } from "../../../controllers/authController.js";

const userRegisterRoutes = express.Router();

userRegisterRoutes.post("/auth/register", registerUser);

export default userRegisterRoutes;
