const mongoose = require("mongoose");
const Permission = require("../Model/SystemModels/PermissionModel");// path adjust kar
require("dotenv").config(); // if you're using .env for DB URL

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/your-db-name";

async function seedPermission() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const permission = new Permission({
      role: "super_admin",
      menuId: "67f621a4c7767a783db76446", // ✅ as string, mongoose will cast
      actions: ["new", "edit", "view", "delete", "export", "print"],
      createdBy: "system",
      updatedBy: "system",
    });

    await permission.save();
    console.log("✅ Permission seeded successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding permission:", err);
    mongoose.disconnect();
  }
}

seedPermission();
