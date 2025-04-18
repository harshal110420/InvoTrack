require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    const exists = await Module.findOne({ moduleId: "SYSTEM" });
    if (exists) {
      console.log("⚠️ SYSTEM module already exists.");
      return process.exit();
    }

    const newModule = new Module({
      moduleId: "SYSTEM",
      name: "System",
      path: "system-module",
      orderBy: 1,
    });

    await newModule.save();
    console.log("✅ Admin module seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
