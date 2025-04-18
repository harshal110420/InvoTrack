require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    const exists = await Module.findOne({ moduleId: "ACCOUNTS" });
    if (exists) {
      console.log("⚠️ ACCOUNTS module already exists.");
      return process.exit();
    }

    const newModule = new Module({
      moduleId: "ACCOUNTS",
      name: "Accounts",
      path: "Accounts-module",
      orderBy: 5,
    });

    await newModule.save();
    console.log("✅ Accounts module seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
