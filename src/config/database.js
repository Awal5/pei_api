import { Sequelize } from "sequelize";

const db = new Sequelize("pei", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
