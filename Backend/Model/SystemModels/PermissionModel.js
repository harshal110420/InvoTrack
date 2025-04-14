const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, ref: "Role" }, // Link to Role
    menuId: { type: Schema.Types.ObjectId, required: true, ref: "Menu" }, // ✅ ObjectId hona chahiye
    actions: [
      {
        type: String,
        enum: ["new", "edit", "view", "print", "delete", "export"],
      },
    ],
    createdBy: { type: String, ref: "User" },
    updatedBy: { type: String, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", PermissionSchema);
