const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");
const userPreferenceRoutes = require("./routes/userPreferenceRoutes");
const savedLocationRoutes = require("./routes/savedLocationRoutes");
const plannerEntryRoutes = require("./routes/plannerEntryRoutes");
const activityRoutes = require("./routes/activityRoutes");
const ragRoutes = require("./routes/ragRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user-preference", userPreferenceRoutes);
app.use("/api/saved-locations", savedLocationRoutes);
app.use("/api/planner-entries", plannerEntryRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/rag", ragRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB(process.env.MONGODB_URI);
    } catch (err) {
      console.warn("MongoDB unavailable, continuing without database:", err.message);
    }
  } else {
    console.warn("MONGODB_URI not set, continuing without database.");
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
};

startServer();
