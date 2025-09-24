import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import exhibitionRoutes from "./routes/exhibitionRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import shopItemRoutes from "./routes/shopItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import specialRoutes from "./routes/specialRoutes.js";

import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Lokální CORS
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use(express.json());

app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/shopItems", shopItemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specials", specialRoutes);

// Připojení k DB
connectDB();

export default app;
