import { Grade } from "../models/Grade.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listGrades = asyncHandler(async (_req, res) => {
  const grades = await Grade.find({ isActive: true }).sort({ order: 1 }).lean();
  res.json({ success: true, count: grades.length, data: grades });
});

export const getGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findOne({
    code: req.params.gradeCode.toLowerCase(),
    isActive: true,
  }).lean();

  if (!grade) {
    return res.status(404).json({ success: false, message: "Grade not found" });
  }

  res.json({ success: true, data: grade });
});

export const createGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.create(req.body);
  res.status(201).json({ success: true, data: grade });
});

export const updateGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findOneAndUpdate(
    { code: req.params.gradeCode.toLowerCase() },
    req.body,
    { new: true, runValidators: true }
  );

  if (!grade) {
    return res.status(404).json({ success: false, message: "Grade not found" });
  }

  res.json({ success: true, data: grade });
});
