import { Article, ArticleImage } from "../models/articleModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getArticle = async (req, res) => {
  try {
    const response = await Article.findAll({
      include: "articleImages",
    });
    if (response.length <= 0) {
      return res.status(404).json({ message: "Article is Empty" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

export const getArticleById = async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Article.findOne({
      where: {
        slug: slug,
      },
      include: "articleImages",
    });
    if (!article) {
      return res.status(404).json({ message: "Artikel Not Found" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createArticle = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const images = req.files.map((file) => file.path);
  try {
    if (req.files.length === 0)
      return res.status(422).json({ message: "at Least Upload 1 Image" });
    const article = await Article.create({
      title: title,
      description: description,
    });

    const imagePromises = images.map((image) => {
      ArticleImage.create({
        imagePath: image,
        articleId: article.id,
      });
    });

    await Promise.all(imagePromises);

    res.status(201).json({
      message: "Article Created",
      data: article,
      images: images,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateArticle = async (req, res) => {
  const { slug } = req.params;
  const title = req.body.title;
  const description = req.body.description;
  const images = req.files.map((file) => file.path);
  try {
    const article = await Article.findOne({ where: { slug: slug } });
    if (!article) return res.status(404).json({ message: "Article Not Found" });

    const oldImages = await ArticleImage.findAll({
      where: { articleId: article.id },
    });

    const newArticle = await Article.update(
      { title, description },
      { where: { slug: slug } }
    );

    await ArticleImage.destroy({ where: { articleId: article.id } });

    oldImages.forEach((image) => {
      const imagePath = path.join(__dirname, "../..", image.imagePath);
      fs.unlinkSync(imagePath);
    });

    const newImagePromises = images.map((image) =>
      ArticleImage.create({ imagePath: image, articleId: article.id })
    );

    await Promise.all(newImagePromises);

    res
      .status(200)
      .json({ message: "Article Updated", data: newArticle, images: images });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

export const deleteArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Article.findOne({ where: { slug: slug } });

    if (!article) return res.status(404).json({ message: "Article Not Found" });

    const images = await ArticleImage.findAll({
      where: { articleId: article.id },
    });

    await ArticleImage.destroy({ where: { articleId: article.id } });

    images.forEach((image) => {
      const imagePath = path.join(__dirname, "../..", image.imagePath);
      fs.unlinkSync(imagePath);
    });

    await Article.destroy({ where: { slug: slug } });

    res.status(200).json({ message: "Article Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
