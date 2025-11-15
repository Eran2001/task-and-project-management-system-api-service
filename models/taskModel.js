const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    name: String,
    description: String,
    deadline: Date,
    people: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: Number,
    priority: { type: String, enum: ["Low", "Medium", "High"] },
    status: { type: String, enum: ["todo", "in-progress", "completed"] },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
