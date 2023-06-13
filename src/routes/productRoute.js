import express from "express";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControler.js";
import multipleImage from "../middleware/multerImage.js";

const router = express.Router();

router.get("/products", getProduct);
router.get("/products/:slug", getProductById);
router.post("/product/create", multipleImage.single("image"), createProduct);
router.put(
  "/product/update/:slug",
  multipleImage.single("image"),
  updateProduct
);
router.delete("/product/delete/:slug", deleteProduct);

export default router;
