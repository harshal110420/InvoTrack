require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Role = require("../Model/SystemConfigureModel/RoleModel");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to DB");

    const updates = [
      {
        roleName: "super_admin",
        displayName: "Super Admin",
        isSystemRole: true,
        status: "active",
      },
      {
        roleName: "admin",
        displayName: "Admin",
        isSystemRole: false,
        status: "active",
      },
    ];

    for (const update of updates) {
      const result = await Role.updateOne(
        { roleName: update.roleName },
        { $set: update }
      );
      console.log(
        `🔁 Role "${update.roleName}" updated (${result.modifiedCount} modified)`
      );
    }

    process.exit();
  })
  .catch((err) => {
    console.error("❌ DB Error", err);
  });
