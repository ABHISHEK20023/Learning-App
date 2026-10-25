import { Router } from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  listQuestions,
  updateQuestion,
} from "../controllers/questionController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listQuestions);
router.get("/:questionId", getQuestion);
router.post("/", adminAuth, createQuestion);
router.patch("/:questionId", adminAuth, updateQuestion);
router.delete("/:questionId", adminAuth, deleteQuestion);

export default router;
