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
router.get("/products/:id", getProductById);
router.post("/product/create", multipleImage.single("image"), createProduct);
router.put("/product/update/:id", multipleImage.single("image"), updateProduct);
router.delete("/product/delete/:id", deleteProduct);

export default router;
