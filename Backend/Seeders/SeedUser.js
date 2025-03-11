require("dotenv").config({ path: __dirname + "/../.env" }); // Load environment variables from .env
const mongoose = require("mongoose");
const User = require("../Model/SystemConfigureModel/UserModel");
const Role = require("../Model/SystemConfigureModel/RoleModel"); // Adjust path



const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "harshalnanoti85@gmail.com" });
    if (existing) {
      console.log("Super Admin user already exists ✅");
      return process.exit();
    }

    // Get role ID of super_admin
    const superAdminRole = await Role.findOne({ roleName: "super_admin" });
    if (!superAdminRole) {
      console.error("❌ 'super_admin' role not found. Seed roles first!");
      return process.exit(1);
    }

    const newUser = new User({
      fullName: "Harshal Nanoti",
      email: "harshalnanoti85@gmail.com",
      password: "Super@110420", // Password will be hashed automatically
      role: superAdminRole._id,
      phoneNumber: "9209038248",
      address: {
        street: "Hudkeshwar road",
        city: "Nagpur",
        state: "Maharashtra",
        country: "India",
        postalCode: "000000",
      },
      isActive: true,
    });

    await newUser.save();
    console.log("✅ Super Admin user created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding Super Admin user:", err.message);
    process.exit(1);
  }
};

seedSuperAdmin();
