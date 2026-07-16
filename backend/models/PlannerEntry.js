const mongoose = require("mongoose");

const plannerEntrySchema = new mongoose.Schema(
  {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedLocation",
      required: true,
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },
    plannedDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlannerEntry", plannerEntrySchema);
