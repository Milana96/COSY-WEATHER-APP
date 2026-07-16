const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    temperatureUnit: {
      type: String,
      enum: ["celsius", "fahrenheit"],
      default: "celsius",
      required: true,
    },
    windSpeedUnit: {
      type: String,
      enum: ["kmh", "mph", "ms"],
      default: "kmh",
      required: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
