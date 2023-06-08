import express from "express";
import {
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import multipleImage from "../middleware/multerImage.js";

const router = express.Router();

router.get("/articles", getArticle);
router.get("/articles/:id", getArticleById);
router.post("/article/create", multipleImage.array("images"), createArticle);
router.put("/article/update/:id", multipleImage.array("images"), updateArticle);
router.delete("/article/delete/:id", deleteArticle);

export default router;
