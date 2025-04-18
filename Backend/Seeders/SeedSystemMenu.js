require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Menu = require("../Model/SystemModels/MenuModel");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    // Step 1: Get the related module (using moduleId)
    const systemModule = await Module.findOne({ moduleId: "SYSTEM" });
    if (!systemModule) {
      console.log("❌ SYSTEM module not found. Seed that first.");
      return process.exit();
    }

    const menusToInsert = [
      {
        parentCode: "00000000", // Root
        moduleId: systemModule._id, // FK Reference
        name: "Menu Management",
        type: "Master",
        menuId: "menu_management",
        isActive: true,
        orderBy: 1,
      },
    ];

    // Step 3: Check if already exists to avoid duplicates
    for (const menu of menusToInsert) {
      const exists = await Menu.findOne({ menuId: menu.menuId });
      if (exists) {
        console.log(`⚠️ Menu '${menu.menuId}' already exists.`);
      } else {
        await Menu.create(menu);
        console.log(`✅ Menu '${menu.menuId}' inserted successfully.`);
      }
    }
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
