import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    gradeCode: { type: String, required: true, lowercase: true, trim: true },
    subjectCode: { type: String, required: true, lowercase: true, trim: true },
    topic: { type: String, default: "general", trim: true },
    questionText: { type: String, required: true, trim: true },
    questionImageUrl: { type: String, default: "" },
    options: {
      type: [optionSchema],
      validate: {
        validator: (value) => value.length >= 2 && value.length <= 6,
        message: "A question needs 2 to 6 options",
      },
    },
    correctOptionId: { type: String, required: true, trim: true },
    explanation: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    marks: { type: Number, default: 1, min: 1 },
    language: { type: String, default: "en" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

questionSchema.index({ gradeCode: 1, subjectCode: 1, isActive: 1 });
questionSchema.index({ topic: 1 });

export const Question = mongoose.model("Question", questionSchema);
