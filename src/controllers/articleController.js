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
      return res.status(404).json({ message: "Article Kosong" });
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
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
      return res.status(404).json({ message: "Artikel Tidak Ditemukan" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createArticle = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const images = req.files.map((file) => file.path);
  console.log(images);
  try {
    if (req.files.length === 0)
      return res.status(422).json({ message: "Upload Minimal 1 Gambar" });
    const article = await Article.create({
      title: title,
      description: description,
      category: category,
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateArticle = async (req, res) => {
  const { slug } = req.params;
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;

  const images = req.files ? req.files.map((file) => file.path) : null;
  try {
    const article = await Article.findOne({ where: { slug: slug } });
    if (!article)
      return res.status(404).json({ message: "Article Tidak Ditemukan" });

    const oldImages = await ArticleImage.findAll({
      where: { articleId: article.id },
    });

    // const newArticle = await Article.update(
    //   {
    //     title: title || article.title,
    //     description: description || article.description,
    //   },
    //   { where: { slug: slug } }
    // );

    const updateArticle = {
      title: title || article.title,
      description: description || article.description,
      category: category || article.category,
    };

    if (images.length > 0) {
      await ArticleImage.destroy({ where: { articleId: article.id } });

      for (const image of oldImages) {
        const imagePath = path.join(__dirname, "../..", image.imagePath);
        fs.unlinkSync(imagePath);
      }

      await Promise.all(
        images.map((image) =>
          ArticleImage.create({
            imagePath: image,
            articleId: article.id,
          })
        )
      );
    }
    await Article.update(updateArticle, {
      where: { slug: slug },
    });
    res.status(200).json({
      message: "Article diupdate",
      data: updateArticle,
      images: images,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    const article = await Article.findOne({ where: { slug: slug } });

    if (!article)
      return res.status(404).json({ message: "Article Tidak Ditemukan" });

    const images = await ArticleImage.findAll({
      where: { articleId: article.id },
    });

    await ArticleImage.destroy({ where: { articleId: article.id } });

    images.forEach((image) => {
      const imagePath = path.join(__dirname, "../..", image.imagePath);
      fs.unlinkSync(imagePath);
    });

    await Article.destroy({ where: { slug: slug } });

    res.status(200).json({ message: "Article dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
