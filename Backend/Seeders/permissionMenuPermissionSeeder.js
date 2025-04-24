require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const Permission = require("../Model/SystemModels/PermissionModel");
const Role = require("../Model/SystemConfigureModel/RoleModel");
const Menu = require("../Model/SystemModels/MenuModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to MongoDB");

    const roleName = "super_admin"; // Change if needed
    const targetMenuId = "permission_management"; // <-- This is the custom menuId (string in your Menu model)
    const actions = ["new", "edit", "view", "delete", "export", "print"];
    const createdBy = "system"; // Can be a userId or system

    // Step 1: Find role and menu
    const role = await Role.findOne({ roleName });
    const menu = await Menu.findOne({ menuId: targetMenuId });

    if (!role || !menu) {
      console.log("❌ Role or Menu not found. Please seed them first.");
      return process.exit();
    }

    // Step 2: Check if permission already exists for this role and menu
    const alreadyExists = await Permission.findOne({
      role: role._id, // Always use ObjectId if ref-based
      menuId: menu._id, // Same here
    });

    if (alreadyExists) {
      console.log("⚠️ Permission already exists.");
      return process.exit();
    }

    // Step 3: Create new permission
    const permission = new Permission({
      role: role._id,
      menuId: menu._id,
      actions,
      createdBy,
      updatedBy: createdBy,
    });

    await permission.save();

    console.log(
      `✅ Permission for [${roleName}] on [${targetMenuId}] seeded successfully!`
    );
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
