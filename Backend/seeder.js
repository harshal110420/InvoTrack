const mongoose = require("mongoose");
const connectDB = require("./config/database"); // Ensure correct path
const User = require("./Model/UserModel");

connectDB(); // Ensure DB Connection

const addTestUser = async () => {
  try {
    const newUser = new User({
      fullName: "John Doe",
      email: "johndoe@example.com",
      password: "password123", // Yeh hashing hone ke baad store hoga
      role: "retailer",
      businessName: "John's Store",
      phoneNumber: "1234567890",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        postalCode: "10001",
      },
      taxIdentificationNumber: "GST123456789",
      isActive: true,
    });

    await newUser.save();
    console.log("✅ Test User Added Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting test user:", error);
    process.exit(1);
  }
};

addTestUser();
