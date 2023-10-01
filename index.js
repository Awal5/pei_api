import express from "express";
import cors from "cors";
import db from "./src/config/database.js";
import authRoute from "./src/routes/authRoute.js";
import articleRoute from "./src/routes/articleRoute.js";
import productRoute from "./src/routes/productRoute.js";
import managementRoute from "./src/routes/managementRoute.js";

import projectRoute from "./src/routes/projectRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

db.authenticate()
  .then(() => {
    console.log("Connection to Database Established Successfully");
  })
  .catch((e) => {
    console.log("Error: ", e);
  });

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//set middleware
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:8000" }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use("/images", express.static(path.join(__dirname)));
app.use("/auth", authRoute);
app.use("/blog", articleRoute);
app.use(productRoute);
app.use(managementRoute);
app.use(projectRoute);

// Start the server
app.listen(PORT, () => console.log(`Server Listening to Port: ${PORT}`));
