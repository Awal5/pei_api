import { Sequelize } from "sequelize";
import db from "../config/database.js";
import slugify from "sequelize-slugify";

const { DataTypes } = Sequelize;

const Article = db.define(
  "articles",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

const ArticleImage = db.define(
  "articles_images",
  {
    imagePath: { type: DataTypes.STRING },
    articleId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

Article.hasMany(ArticleImage, {
  foreignKey: "articleId",
  as: "article-images",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ArticleImage.belongsTo(Article, {
  foreignKey: "articleId",
  as: "article",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

slugify.slugifyModel(Article, {
  source: ["title"],
  overwrite: true,
  bulkUpdate: true,
});
export { Article, ArticleImage };

// db.sync({ force: true });
