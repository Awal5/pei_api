import { Sequelize } from "sequelize";
import db from "../config/database.js";
import slugify from "sequelize-slugify";

const { DataTypes } = Sequelize;

const Product = db.define(
  "product",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    image: { type: DataTypes.STRING, allowNull: false },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      isRequired: true,
    },
  },
  {
    freezeTableName: true,
  }
);

slugify.slugifyModel(Product, {
  source: ["name"],
  overwrite: true,
  bulkUpdate: true,
});

export default Product;
// db.sync({ force: true });
