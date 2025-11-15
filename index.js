import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "module-alias/register.js";

import connectDB from "@configs/db.js";

import adminRegister from "@routes/auth/adminRegister.js";
import adminLogin from "@routes/auth/adminLogin.js";
import userCreate from "@routes/users/userCreate.js";
import projectsRoute from "@routes/projects/projectCreate.js";
import tasksRoute from "@routes/tasks/taskCreate.js";
import messagesRoute from "@routes/messages/messageSend.js";

import verifyToken from "@middlewares/verifyToken.js";

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

// user create
app.use("/api/v1", userCreate);

// project create
app.use("/api/v1", verifyToken, projectsRoute);

// task create
app.use("/api/v1", verifyToken, tasksRoute);

// message create
app.use("/api/v1", verifyToken, messagesRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
