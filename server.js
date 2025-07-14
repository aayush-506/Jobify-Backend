import "express-async-errors";
import express from "express";
const app = express();
import morgan from "morgan";
import * as dotenv from "dotenv";

import cors from "cors";
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
dotenv.config();

import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// Routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
// Public
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Cloudinary
import cloudinary from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Helmet
import helmet from "helmet";
// Sanitizer
import mongoSanitize from "express-mongo-sanitize";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.use("/api/jobs", authenticateUser, jobRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", authenticateUser, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5002;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}.`);
  });
} catch (error) {
  console.log(error.message);
  process.exit(1);
}
