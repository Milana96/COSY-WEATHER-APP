const mongoose = require("mongoose");

const savedLocationSchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedLocation", savedLocationSchema);
