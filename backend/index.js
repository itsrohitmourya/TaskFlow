import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import db from "./utils/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", `${process.env.BASE_URL}`],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());

db();

// consuming routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log("app is listening on PORT", PORT);
});
