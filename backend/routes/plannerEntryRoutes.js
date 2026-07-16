const express = require("express");
const PlannerEntry = require("../models/PlannerEntry");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const entries = await PlannerEntry.find()
      .populate("locationId")
      .populate("activityId")
      .sort({ plannedDate: 1 });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await PlannerEntry.create(req.body);
    const hydrated = await PlannerEntry.findById(created._id)
      .populate("locationId")
      .populate("activityId");

    res.status(201).json(hydrated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await PlannerEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("locationId")
      .populate("activityId");

    if (!updated) {
      return res.status(404).json({ message: "Planner entry not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PlannerEntry.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Planner entry not found." });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
