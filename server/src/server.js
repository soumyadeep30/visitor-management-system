import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import visitorRoutes from "./routes/visitorRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Employee Visitor Management API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Visitor Management API is running",
  });
});

// Visitor routes
app.use("/api/visitors", visitorRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });