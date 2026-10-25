export function toPublicQuestion(question, { includeAnswer = false } = {}) {
  const payload = {
    id: question._id,
    gradeCode: question.gradeCode,
    subjectCode: question.subjectCode,
    topic: question.topic,
    questionText: question.questionText,
    questionImageUrl: question.questionImageUrl,
    options: question.options,
    difficulty: question.difficulty,
    marks: question.marks,
    language: question.language,
  };

  if (includeAnswer) {
    payload.correctOptionId = question.correctOptionId;
    payload.explanation = question.explanation;
  }

  return payload;
}
