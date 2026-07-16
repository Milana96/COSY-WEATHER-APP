const express = require("express");
const SavedLocation = require("../models/SavedLocation");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locations = await SavedLocation.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await SavedLocation.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await SavedLocation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Saved location not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SavedLocation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Saved location not found." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
