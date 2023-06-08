import express from "express";
import {
  getManagement,
  getManagementById,
  createManagement,
  updateManagement,
  deleteManagement,
} from "../controllers/managementController.js";
import multipleImage from "../middleware/multerImage.js";

const router = express.Router();

router.get("/managements", getManagement);
router.get("/management/:id", getManagementById);
router.post(
  "/management/create",
  multipleImage.single("image"),
  createManagement
);
router.put(
  "/management/update/:id",
  multipleImage.single("image"),
  updateManagement
);
router.delete("/management/delete/:id", deleteManagement);

export default router;
