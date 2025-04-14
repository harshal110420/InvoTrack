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
    const menuId = "role_management"; // Your actual menuId
    const actions = ["new", "edit", "view", "delete", "export", "print"];
    const createdBy = "system"; // Can be a userId or system

    // Check if permission already exists
    const alreadyExists = await Permission.findOne({ role: roleName, menuId });
    if (alreadyExists) {
      console.log("⚠️ Permission already exists.");
      return process.exit();
    }

    // Optional: Check if role and menu exist
    const role = await Role.findOne({ roleName });
    const menu = await Menu.findOne({ menuId });

    if (!role || !menu) {
      console.log("❌ Role or Menu not found. Seed them first.");
      return process.exit();
    }

    const permission = new Permission({
      role: roleName, // or role._id if using ObjectId
      menuId,
      actions,
      createdBy,
      updatedBy: createdBy,
    });

    await permission.save();
    console.log(
      `✅ Permission for [${roleName}] on [${menuId}] seeded successfully!`
    );
    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB connection error", err);
  });
