import { connectDb } from "../config/db.js";
import { Grade } from "../models/Grade.js";
import { Question } from "../models/Question.js";
import { Subject } from "../models/Subject.js";
import { grades, questions, subjects } from "./data.js";

async function seed() {
  await connectDb();

  await Promise.all([Grade.deleteMany({}), Subject.deleteMany({}), Question.deleteMany({})]);

  const createdGrades = await Grade.insertMany(grades);
  const gradeByCode = new Map(createdGrades.map((grade) => [grade.code, grade]));

  const subjectDocs = subjects.map((subject) => {
    const grade = gradeByCode.get(subject.gradeCode);
    return { ...subject, grade: grade._id };
  });
  const createdSubjects = await Subject.insertMany(subjectDocs);
  const subjectKey = new Map(
    createdSubjects.map((subject) => [`${subject.gradeCode}:${subject.code}`, subject])
  );

  const questionDocs = questions.map((question) => {
    const grade = gradeByCode.get(question.gradeCode);
    const subject = subjectKey.get(`${question.gradeCode}:${question.subjectCode}`);
    return {
      ...question,
      grade: grade._id,
      subject: subject._id,
    };
  });
  await Question.insertMany(questionDocs);

  console.log(`Seeded ${createdGrades.length} grades, ${createdSubjects.length} subjects, ${questionDocs.length} questions`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
