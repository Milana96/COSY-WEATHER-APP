const express = require("express");
const UserPreference = require("../models/UserPreference");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pref = await UserPreference.findOne().sort({ createdAt: -1 });
    res.json(pref || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const updated = await UserPreference.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
