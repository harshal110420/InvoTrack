require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Menu = require("../Model/SystemModels/MenuModel");
const Module = require("../Model/SystemModels/ModuleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to DB");

    // Step 1: Get the related module (using moduleId)
    const adminModule = await Module.findOne({ moduleId: "ADMIN" });
    if (!adminModule) {
      console.log("❌ ADMIN module not found. Seed that first.");
      return process.exit();
    }

    // Step 2: Sample Menus to Seed
    const menusToInsert = [
      {
        parentCode: "00000000", // Root
        moduleId: adminModule._id, // FK Reference
        name: "User Management",
        type: "Master",
        menuId: "user_management",
      },
      {
        parentCode: "00000000", // Root
        moduleId: adminModule._id,
        name: "Role Management",
        type: "Master",
        menuId: "role_management",
      },
      {
        parentCode: "00000000", // Root
        moduleId: adminModule._id,
        name: "Users Report",
        type: "Report",
        menuId: "users_report",
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
