import express from "express";
import Visitor from "../models/Visitor.js";

const router = express.Router();

// GET all visitors, with optional name/mobile search
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { visitorName: { $regex: search, $options: "i" } },
            { mobileNumber: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const visitors = await Visitor.find(filter).sort({ visitDateTime: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch visitors", error: error.message });
  }
});

// GET one visitor
router.get("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json(visitor);
  } catch (error) {
    res.status(400).json({ message: "Invalid visitor ID" });
  }
});

// CREATE visitor
router.post("/", async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ message: "Could not create visitor", error: error.message });
  }
});

// UPDATE visitor
router.put("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json(visitor);
  } catch (error) {
    res.status(400).json({ message: "Could not update visitor", error: error.message });
  }
});

// DELETE visitor
router.delete("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Could not delete visitor" });
  }
});

export default router;
