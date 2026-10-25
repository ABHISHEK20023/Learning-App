import { Grade } from "../models/Grade.js";
import { Subject } from "../models/Subject.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listSubjects = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.params.gradeCode) {
    filter.gradeCode = req.params.gradeCode.toLowerCase();
  } else if (req.query.grade) {
    filter.gradeCode = String(req.query.grade).toLowerCase();
  }

  const subjects = await Subject.find(filter).sort({ name: 1 }).lean();
  res.json({ success: true, count: subjects.length, data: subjects });
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.subjectId).lean();
  if (!subject || !subject.isActive) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }
  res.json({ success: true, data: subject });
});

export const createSubject = asyncHandler(async (req, res) => {
  const grade = await Grade.findOne({ code: String(req.body.gradeCode).toLowerCase() });
  if (!grade) {
    return res.status(400).json({ success: false, message: "Invalid gradeCode" });
  }

  const subject = await Subject.create({
    ...req.body,
    grade: grade._id,
    gradeCode: grade.code,
  });

  res.status(201).json({ success: true, data: subject });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.subjectId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!subject) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  res.json({ success: true, data: subject });
});
