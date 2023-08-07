import express from "express";
import {
  getCareer,
  getCareerById,
  addCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";
import multipleImage from "../middleware/multerImage.js";

const router = express.Router();

router.get("/careers", getCareer);
router.get("/career/:slug", getCareerById);
router.post("/career/add", multipleImage.single("image"), addCareer);
router.put("/career/update/:slug", multipleImage.single("image"), updateCareer);
router.delete("/career/delete/:slug", deleteCareer);

export default router;
