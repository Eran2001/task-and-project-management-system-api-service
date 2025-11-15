const projectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    progress: Number,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
