import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "owner", "tester", "designer", "developer", "pm"],
      required: true,
    },
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
