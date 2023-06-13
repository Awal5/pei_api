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
router.get("/management/:slug", getManagementById);
router.post(
  "/management/create",
  multipleImage.single("image"),
  createManagement
);
router.put(
  "/management/update/:slug",
  multipleImage.single("image"),
  updateManagement
);
router.delete("/management/delete/:slug", deleteManagement);

export default router;
