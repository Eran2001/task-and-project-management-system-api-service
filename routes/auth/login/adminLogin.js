import express from "express";

import { adminLogin } from "@controllers/adminAuthController.js";

const adminRegister = express.Router();

adminRegister.post("/auth/login", adminLogin);

export default adminRegister;
