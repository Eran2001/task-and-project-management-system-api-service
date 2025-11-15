import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "module-alias/register.js";

import connectDB from "@configs/db.js";

import adminRegister from "@routes/auth/adminRegister.js";
import adminLogin from "@routes/auth/adminLogin.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// admin registration
app.use("/api/v1", adminRegister);

// admin login
app.use("/api/v1", adminLogin);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
