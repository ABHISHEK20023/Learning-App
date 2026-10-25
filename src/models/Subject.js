import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      required: true,
    },
    gradeCode: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "#4CAF50" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subjectSchema.index({ gradeCode: 1, code: 1 }, { unique: true });

export const Subject = mongoose.model("Subject", subjectSchema);
