import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    ageRange: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Grade = mongoose.model("Grade", gradeSchema);
