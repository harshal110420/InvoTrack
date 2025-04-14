const RoleModel = require("./../Model/SystemConfigureModel/RoleModel");

// ➤ Create Role
const createRole = async (req, res) => {
  try {
    const { roleName, displayName, isSystemRole = false, status = "active" } = req.body;

    // Check if roleName already exists
    const existingRole = await RoleModel.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await RoleModel.create({
      roleName,
      displayName,
      isSystemRole,
      status,
    });

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Get All Roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json({ message: "Roles fetched successfully", roles });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Get Single Role
const getSingleRole = async (req, res) => {
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
const updateRole = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent editing system role name
    if (role.isSystemRole && req.body.roleName && req.body.roleName !== role.roleName) {
      return res.status(403).json({ message: "System roles cannot be renamed" });
    }

    const updatedFields = {
      displayName: req.body.displayName ?? role.displayName,
      status: req.body.status ?? role.status,
    };

    // Only update roleName if it's not system role
    if (!role.isSystemRole && req.body.roleName) {
      updatedFields.roleName = req.body.roleName;
    }

    const updatedRole = await RoleModel.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ Delete Role
const deleteRole = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.isSystemRole) {
      return res.status(403).json({ message: "System roles cannot be deleted" });
    }

    await RoleModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
};
