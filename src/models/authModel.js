import { Sequelize, UUIDV4 } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Admin = db.define(
  "admin",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Admin;
