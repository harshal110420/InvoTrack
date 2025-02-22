const express = require("express");
require("dotenv").config(); // Yeh sahi hai
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Database Connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀🚀🚀 Server running on port ${PORT} 🚀🚀🚀`);
});
