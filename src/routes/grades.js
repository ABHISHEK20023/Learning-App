import { Router } from "express";
import {
  createGrade,
  getGrade,
  listGrades,
  updateGrade,
} from "../controllers/gradeController.js";
import { listSubjects } from "../controllers/subjectController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listGrades);
router.get("/:gradeCode", getGrade);
router.get("/:gradeCode/subjects", listSubjects);
router.post("/", adminAuth, createGrade);
router.patch("/:gradeCode", adminAuth, updateGrade);

export default router;
