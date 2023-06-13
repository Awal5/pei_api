import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/database.js";
import slugify from "sequelize-slugify";

const { DataTypes } = Sequelize;

const Management = db.define(
  "management",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: { type: DataTypes.STRING, unique: true },
    image: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    facebook: {
      type: DataTypes.STRING,
      allowNull: false,
      isRequired: true,
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: false,
      isRequired: true,
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: false,
      isRequired: true,
    },
  },
  {
    freezeTableName: true,
  }
);

slugify.slugifyModel(Management, {
  source: ["name"],
  overwrite: true,
  bulkUpdate: true,
});
export default Management;

// db.sync({ force: true });
