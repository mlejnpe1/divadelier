import express from "express";
import exhibitionRoutes from "./routes/exhibitionRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import shopItemRoutes from "./routes/shopItemRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import specialRoutes from "./routes/specialRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/shopItems", shopItemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specials", specialRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
