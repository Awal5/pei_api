import {
  getProject,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import multipleImage from "../middleware/multerImage.js";
import express from "express";
const router = express.Router();

router.get("/projects", getProject);
router.get("/project/:slug", getProjectById);
router.post("/project/create", multipleImage.single("image"), createProject);
router.put(
  "/project/update/:slug",
  multipleImage.single("image"),
  updateProject
);
router.delete("/project/delete/:slug", deleteProject);

export default router;
