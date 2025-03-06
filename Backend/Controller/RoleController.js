const RoleModel = require("./../Model/SystemConfigureModel/RoleModel");

// ➤ Create Role
exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    // Check if the role already exists
    const existingRole = await RoleModel.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await RoleModel.create({ roleName });
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Get All Roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find();
    res.status(200).json({ message: "Roles fetched successfully", roles });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Get Single Role
exports.getSingleRole = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role found", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Update Role
exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await RoleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res
      .status(200)
      .json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const role = await RoleModel.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
