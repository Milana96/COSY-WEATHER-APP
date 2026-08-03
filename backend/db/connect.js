const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      maxPoolSize: 5,
    });
  }

  try {
    await connectionPromise;
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

module.exports = connectDB;
