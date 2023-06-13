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
router.get("/article/:slug", getArticleById);
router.post("/article/create", multipleImage.array("images"), createArticle);
router.put(
  "/article/update/:slug",
  multipleImage.array("images"),
  updateArticle
);
router.delete("/article/delete/:slug", deleteArticle);

export default router;
