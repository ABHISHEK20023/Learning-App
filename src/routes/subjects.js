import { Router } from "express";
import {
  createSubject,
  getSubject,
  listSubjects,
  updateSubject,
} from "../controllers/subjectController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listSubjects);
router.get("/:subjectId", getSubject);
router.post("/", adminAuth, createSubject);
router.patch("/:subjectId", adminAuth, updateSubject);

export default router;
