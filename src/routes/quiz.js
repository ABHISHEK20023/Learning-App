import { Router } from "express";
import { startQuiz, submitQuiz } from "../controllers/quizController.js";

const router = Router();

router.get("/", startQuiz);
router.post("/submit", submitQuiz);

export default router;
