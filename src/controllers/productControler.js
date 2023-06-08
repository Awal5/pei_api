import Product from "../models/productModel.js";
import fs from "fs";

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    if (!product) return res.status(404).json({ message: "Product is Empty" });
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ where: { id: id } });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const name = req.body.name;
  const image = req.file.path;
  const description = req.body.description;

  try {
    if (!image)
      return res.status(422).json({ message: "Image Must be Upload" });
    await Product.create({
      name,
      image,
      description,
    });
    res.status(201).json({ message: "Product Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something Wrong When Create Product" });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const name = req.body.name;
  const image = req.file.path;
  const description = req.body.description;
  try {
    const product = await Product.findByPk(productId);
    if (!product)
      return res.status(404).json({ message: "Product Not Available" });

    if (image && image !== product.image) {
      fs.unlinkSync(product.image);
    }

    await product.update({
      name,
      image,
      description,
    });
    res.status(200).json({ message: "Product Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something Wrong When Update Product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);

    if (!product)
      return res.status(404).json({ message: "Product not Available" });

    await product.destroy();

    fs.unlinkSync(product.image);

    res.status(200).json({ message: "Product Deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something Wrong When Delete Product" });
  }
};
