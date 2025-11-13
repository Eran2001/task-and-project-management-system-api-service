import express from "express";

import { loginUser } from "../../../controllers/authController.js";

const userRegisterRoutes = express.Router();

userRegisterRoutes.post("/auth/login", loginUser);

export default userRegisterRoutes;
