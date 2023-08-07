import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/database.js";
import slugify from "sequelize-slugify";

const { DataTypes } = Sequelize;

const Project = db.define(
  "project",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    image: { type: DataTypes.STRING, allowNull: false },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

slugify.slugifyModel(Project, {
  source: ["name"],
  overwrite: true,
  bulkUpdate: true,
});

export default Project;
// db.sync({ force: true });
