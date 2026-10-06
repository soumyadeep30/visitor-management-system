import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import visitorRoutes from "./routes/visitorRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Visitor Management API is running" });
});

app.use("/api/visitors", visitorRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  

  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
