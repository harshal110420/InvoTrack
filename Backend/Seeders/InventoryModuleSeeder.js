require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    const exists = await Module.findOne({ moduleId: "INVENTORY" });
    if (exists) {
      console.log("⚠️ INVENTORY module already exists.");
      return process.exit();
    }

    const newModule = new Module({
      moduleId: "INVENTORY",
      name: "Inventory",
      path: "inventory-module",
      orderBy: 3,
    });

    await newModule.save();
    console.log("✅ Inventory module seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
