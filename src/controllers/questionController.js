import { Grade } from "../models/Grade.js";
import { Question } from "../models/Question.js";
import { Subject } from "../models/Subject.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPublicQuestion } from "../utils/questionView.js";

function buildFilter(query) {
  const filter = { isActive: true };
  if (query.grade) filter.gradeCode = String(query.grade).toLowerCase();
  if (query.subject) filter.subjectCode = String(query.subject).toLowerCase();
  if (query.topic) filter.topic = String(query.topic);
  if (query.difficulty) filter.difficulty = String(query.difficulty).toLowerCase();
  if (query.language) filter.language = String(query.language).toLowerCase();
  return filter;
}

export const listQuestions = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const shuffle = String(req.query.shuffle || "false") === "true";
  const includeAnswer = String(req.query.includeAnswer || "false") === "true";

  let questions;
  if (shuffle) {
    questions = await Question.aggregate([{ $match: filter }, { $sample: { size: limit } }]);
  } else {
    questions = await Question.find(filter).sort({ createdAt: 1 }).limit(limit).lean();
  }

  res.json({
    success: true,
    count: questions.length,
    data: questions.map((question) => toPublicQuestion(question, { includeAnswer })),
  });
});

export const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId).lean();
  if (!question || !question.isActive) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  res.json({
    success: true,
    data: toPublicQuestion(question, { includeAnswer: false }),
  });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const grade = await Grade.findOne({ code: String(req.body.gradeCode).toLowerCase() });
  const subject = await Subject.findOne({
    gradeCode: String(req.body.gradeCode).toLowerCase(),
    code: String(req.body.subjectCode).toLowerCase(),
  });

  if (!grade || !subject) {
    return res.status(400).json({
      success: false,
      message: "Invalid gradeCode or subjectCode",
    });
  }

  const optionIds = (req.body.options || []).map((option) => option.id);
  if (!optionIds.includes(req.body.correctOptionId)) {
    return res.status(400).json({
      success: false,
      message: "correctOptionId must match one of the option ids",
    });
  }

  const question = await Question.create({
    ...req.body,
    grade: grade._id,
    subject: subject._id,
    gradeCode: grade.code,
    subjectCode: subject.code,
  });

  res.status(201).json({ success: true, data: question });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.questionId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  res.json({ success: true, data: question });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.questionId,
    { isActive: false },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  res.json({ success: true, message: "Question deactivated" });
});
