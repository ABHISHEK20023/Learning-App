import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import gradeRoutes from "./routes/grades.js";
import questionRoutes from "./routes/questions.js";
import quizRoutes from "./routes/quiz.js";
import subjectRoutes from "./routes/subjects.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.get("/api/v1", (_req, res) => {
  res.json({
    success: true,
    name: "Learning Game API",
    version: "1.0.0",
    endpoints: {
      grades: "GET /api/v1/grades",
      subjectsByGrade: "GET /api/v1/grades/:gradeCode/subjects",
      questions: "GET /api/v1/questions?grade=class-1&subject=maths&limit=10&shuffle=true",
      startQuiz: "GET /api/v1/quiz?grade=class-1&subject=maths&count=10",
      submitQuiz: "POST /api/v1/quiz/submit",
    },
  });
});

app.use("/api/v1/grades", gradeRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/quiz", quizRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
