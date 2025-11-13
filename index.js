import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./configs/db.js";

import userRegisterRoutes from "./routes/auth/register/userRegisterRoutes.js";
import userLoginRoutes from "./routes/auth/login/userLogin.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// user registration
app.use("/api/v1", userRegisterRoutes);

// user login
app.use("/api/v1", userLoginRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
