require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const Role = require("../Model/SystemConfigureModel/RoleModel"); // adjust path

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const roles = ["super_admin", "admin"];
    for (const roleName of roles) {
      const exists = await Role.findOne({ roleName });
      if (!exists) {
        await Role.create({ roleName });
        console.log(`Role ${roleName} created ✅`);
      } else {
        console.log(`Role ${roleName} already exists`);
      }
    }

    process.exit();
  } catch (err) {
    console.error("Error seeding roles:", err);
    process.exit(1);
  }
};

seedRoles();
