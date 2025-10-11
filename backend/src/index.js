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

const allowedOrigins = [
  "http://localhost:5173",
  "https://divadelier.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/shopItems", shopItemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specials", specialRoutes);

await connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running locally on PORT: ${PORT}`);
});
