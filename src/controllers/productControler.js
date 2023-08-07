import Product from "../models/productModel.js";
import fs from "fs";

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    if (product.length === 0)
      return res.status(404).json({ message: "Product Kosong" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ where: { slug: slug } });

    if (!product) {
      return res.status(404).json({ message: "Product Tidak Ditemukan" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const name = req.body.name;
  const image = req.file.path;
  const description = req.body.description;

  try {
    if (!name || !description)
      return res.status(400).json({ message: "Semua Field harus diisi" });
    if (!image)
      return res.status(422).json({ message: "Gambar Harus diupload" });
    const product = await Product.create({
      name: name,
      image: image,
      description: description,
    });
    res.status(201).json({ message: "Product ditambahkan", data: product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { slug } = req.params;
  const name = req.body.name;
  const image = req.file ? req.file.path : null;
  const description = req.body.description;
  try {
    const product = await Product.findOne({ where: { slug: slug } });
    if (!product)
      return res.status(404).json({ message: "Product Tidak Tersedia" });

    if (image && image !== product.image) {
      fs.unlinkSync(product.image);
    }

    const newProduct = await product.update({
      name: name || product.name,
      image: image || product.image,
      description: description || product.description,
    });
    res.status(200).json({ message: "Product diupdate", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ where: { slug: slug } });

    if (!product)
      return res.status(404).json({ message: "Product Tidak Tersedia" });

    await product.destroy();

    fs.unlinkSync(product.image);

    res.status(200).json({ message: "Product dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
