import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: [
        "admin",
        "owner",
        "tester",
        "frontend-developer",
        "backend-developer",
        "business-analyst",
        "database-manager",
      ],
      required: true,
    },
    organizationName: { type: String },
    projectName: { type: String },
    numberOfEmployees: { type: Number },
    departmentName: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
