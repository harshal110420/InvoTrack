const express = require("express");
require("dotenv").config(); // Load environment variables
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { errorHandler, notFound } = require("./Middleware/ErrorMiddleware"); // Import Error Handlers
const roleRoutes = require("./Routes/RoleRoutes");
const userRoutes = require("./Routes/UserRoutes");
const taxConfigRoutes = require("./Routes/TaxConfigRoutes");
const app = express();

// ✅ Connect Database
connectDB();

// ✅ Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true })); // Allow only specific frontend
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ API Routes
app.use("/api/roles", roleRoutes); // User-related routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/tax-config", taxConfigRoutes); // User-related routes

// ✅ Error Handling Middleware (Global)
app.use(notFound);
app.use(errorHandler);

// ✅ Database Connection & Server Listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀🚀🚀 Server running on port ${PORT} 🚀🚀🚀`);
});
