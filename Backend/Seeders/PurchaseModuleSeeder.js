require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    const exists = await Module.findOne({ moduleId: "PURCHASE" });
    if (exists) {
      console.log("⚠️ PURCHASE module already exists.");
      return process.exit();
    }

    const newModule = new Module({
      moduleId: "PURCHASE",
      name: "Purchase",
      path: "purchase-module",
      orderBy: 3,
    });

    await newModule.save();
    console.log("✅ Purchase module seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
