import { Question } from "../models/Question.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPublicQuestion } from "../utils/questionView.js";

export const startQuiz = asyncHandler(async (req, res) => {
  const grade = String(req.query.grade || "").toLowerCase();
  const subject = String(req.query.subject || "").toLowerCase();
  const count = Math.min(Number(req.query.count) || 10, 30);

  if (!grade || !subject) {
    return res.status(400).json({
      success: false,
      message: "Query params grade and subject are required",
    });
  }

  const questions = await Question.aggregate([
    { $match: { isActive: true, gradeCode: grade, subjectCode: subject } },
    { $sample: { size: count } },
  ]);

  res.json({
    success: true,
    quiz: {
      grade,
      subject,
      questionCount: questions.length,
      questions: questions.map((question) => toPublicQuestion(question)),
    },
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
  if (answers.length === 0) {
    return res.status(400).json({
      success: false,
      message: "answers array is required",
    });
  }

  const ids = answers.map((item) => item.questionId);
  const questions = await Question.find({ _id: { $in: ids }, isActive: true }).lean();
  const byId = new Map(questions.map((question) => [String(question._id), question]));

  let score = 0;
  let totalMarks = 0;
  const results = answers.map((item) => {
    const question = byId.get(String(item.questionId));
    if (!question) {
      return {
        questionId: item.questionId,
        correct: false,
        message: "Question not found",
      };
    }

    totalMarks += question.marks;
    const correct = item.selectedOptionId === question.correctOptionId;
    if (correct) score += question.marks;

    return {
      questionId: question._id,
      selectedOptionId: item.selectedOptionId,
      correctOptionId: question.correctOptionId,
      correct,
      explanation: question.explanation,
      marksAwarded: correct ? question.marks : 0,
    };
  });

  res.json({
    success: true,
    data: {
      attempted: answers.length,
      score,
      totalMarks,
      percentage: totalMarks ? Math.round((score / totalMarks) * 100) : 0,
      results,
    },
  });
});
