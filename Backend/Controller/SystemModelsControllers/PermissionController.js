const Permission = require("../../Model/SystemModels/PermissionModel");
const Menu = require("../../Model/SystemModels/MenuModel");
const Module = require("../../Model/SystemModels/ModuleModel");
const Role = require("../../Model/SystemConfigureModel/RoleModel");
const VALID_ACTIONS = ["new", "edit", "view", "print", "delete", "export"];
const mongoose = require("mongoose");
const { Types } = require("mongoose");

// ✅ Get permissions for a role
const getPermissionsByRole = async (req, res) => {
  // console.log("🔥 API HIT: getPermissionsByRole");
  try {
    // ✅ Step 1: Find Role ObjectId using name
    const roleDoc = await Role.findOne({ roleName: req.params.role });
    // console.log("🧠 Finding Role by name:", req.params.role);

    if (!roleDoc) {
      return res.status(404).json({ error: "Role not found" });
    }
    const rawPermissions = await Permission.find({
      role: roleDoc._id,
      menuId: { $ne: null },
    })
      .populate({
        path: "menuId",
        populate: {
          path: "moduleId",
          model: "Module",
        },
      })
      .lean();
    "🎯 Permissions fetched:", rawPermissions.length;

    // ✅ Transform to structured response
    const structured = {};

    rawPermissions.forEach((perm) => {
      const mod = perm.menuId?.moduleId;
      const menu = perm.menuId;

      if (!mod || !menu) return; // Skip if data is incomplete

      const moduleId = mod._id.toString();

      // Initialize module if not already present
      if (!structured[moduleId]) {
        structured[moduleId] = {
          moduleName: mod.name,
          modulePath: mod.path,
          orderBy: mod.orderBy || 99,
          menus: {
            Master: [],
            Transaction: [],
            Report: [],
          },
        };
      }

      // Push this menu into its type bucket
      structured[moduleId].menus[menu.type].push({
        name: menu.name,
        menuId: menu.menuId,
        actions: perm.actions,
      });
    });

    // ✅ Convert object to sorted array based on module order
    const response = Object.values(structured).sort(
      (a, b) => a.orderBy - b.orderBy
    );

    res.json(response);
  } catch (err) {
    console.error("❌ Error while fetching structured permissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get a specific permission by ID (for update or view)
const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id)
      .populate({
        path: "menuId",
        populate: {
          path: "moduleId",
          model: "Module",
        },
      })
      .lean();

    if (!permission) {
      return res.status(404).json({ error: "Permission not found" });
    }

    const { role, menuId, actions } = permission;

    // Prepare response with structured permission info
    const structuredPermission = {
      role,
      menu: {
        name: permission.menuId.name,
        type: permission.menuId.type,
        moduleName: permission.menuId.moduleId.name,
        actions,
      },
    };

    res.json(structuredPermission);
  } catch (err) {
    console.error("❌ Error while fetching permission:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create or update permissions
const createOrUpdatePermission = async (req, res) => {
  try {
    const { role, menuId, actions, actionType = "replace" } = req.body;

    const roleName = typeof role === "string" ? role : role.roleName;

    if (!roleName || !menuId || !Array.isArray(actions)) {
      return res.status(400).json({
        error: "Fields 'role', 'menuId', and 'actions[]' are required.",
      });
    }

    const invalidActions = actions.filter(
      (action) => !VALID_ACTIONS.includes(action)
    );
    if (invalidActions.length > 0) {
      return res.status(400).json({
        error: `Invalid actions found: ${invalidActions.join(", ")}`,
      });
    }

    const roleDoc = await Role.findOne({ displayName: roleName });
    if (!roleDoc) {
      return res.status(404).json({ error: "Role not found" });
    }

    const menuDoc = await Menu.findById(menuId);
    if (!menuDoc) {
      return res.status(404).json({ error: "Menu not found for given menuId" });
    }

    const objectMenuId = menuDoc._id;
    let permission = await Permission.findOne({
      role: roleDoc._id,
      menuId: objectMenuId,
    });

    const userId = req.user?._id || "system";

    if (permission) {
      if (actionType === "add") {
        permission.actions = [...new Set([...permission.actions, ...actions])];
      } else if (actionType === "remove") {
        permission.actions = permission.actions.filter(
          (a) => !actions.includes(a)
        );
      } else {
        permission.actions = actions;
      }

      permission.updatedBy = userId;
      await permission.save();
    } else {
      if (actionType === "remove") {
        return res.status(400).json({
          error: "Cannot remove actions from a non-existent permission.",
        });
      }

      permission = new Permission({
        role: roleDoc._id,
        menuId: objectMenuId,
        actions,
        createdBy: userId,
      });

      await permission.save();
    }

    return res
      .status(201)
      .json({ message: "Permission saved successfully", permission });
  } catch (err) {
    console.error("❌ Error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    console.log("🔥 Fetching all permissions...");

    // Fetch all permissions, populating both the menu and role data
    const allPermissions = await Permission.find()
      .populate({
        path: "menuId",
        populate: {
          path: "moduleId", // Populating the module data
          model: "Module",
        },
      })
      .populate("role", "displayName") // Populate role details
      .lean(); // Use lean() for faster queries

    // Fetch all menus from the database (including new ones)
    const allMenus = await Menu.find().lean(); // This ensures new menus are also included

    // Initialize an object to store the organized data
    const organized = {};

    // Organize all permissions into modules, roles, and menus
    allPermissions.forEach((perm) => {
      const module = perm.menuId?.moduleId;
      const menu = perm.menuId;
      const role = perm.role;

      if (!module || !menu) {
        console.log("⚠️ Skipping permission due to missing module/menu data.");
        return; // Skip incomplete data
      }

      const moduleId = module._id.toString();
      const menuId = menu._id.toString();
      const roleId = role._id.toString();

      console.log(
        `🔑 ModuleId: ${moduleId}, MenuId: ${menuId}, RoleId: ${roleId}`
      );

      // Initialize module if not present
      if (!organized[moduleId]) {
        organized[moduleId] = {
          moduleName: module.name,
          modulePath: module.path,
          orderBy: module.orderBy || 99,
          roles: {}, // role-wise permissions
        };
        console.log(`🆕 Added new module: ${module.name}`);
      }

      // Initialize role under this module if not present
      if (!organized[moduleId].roles[roleId]) {
        organized[moduleId].roles[roleId] = {
          roleId,
          roleName: role.displayName,
          permissions: [], // Empty permissions array
        };
        console.log(
          `🆕 Added new role: ${role.displayName} under module: ${module.name}`
        );
      }

      // Add permission entry to the role
      organized[moduleId].roles[roleId].permissions.push({
        menuName: menu.name,
        menuType: menu.type,
        menuId,
        actions: perm.actions,
      });
      console.log(
        `✔️ Added permission for role: ${role.displayName} to menu: ${menu.name}`
      );
    });

    // Add new menus (those that don't have permissions yet) with default false actions
    allMenus.forEach((menu) => {
      const moduleId = menu.moduleId.toString();

      // If the menu doesn't exist in organized module or role, we need to add it with default actions
      if (!organized[moduleId]) {
        organized[moduleId] = {
          moduleName: menu.moduleId.name,
          modulePath: menu.moduleId.path,
          orderBy: menu.moduleId.orderBy || 99,
          roles: {},
        };
      }

      // Iterate through roles to add the new menu with default actions
      Object.values(organized[moduleId].roles).forEach((role) => {
        if (!role.permissions.find((p) => p.menuId === menu._id.toString())) {
          role.permissions.push({
            menuName: menu.name,
            menuType: menu.type,
            menuId: menu._id.toString(),
            actions: [], // Default empty actions (false)
          });
          console.log(
            `🆕 Added new menu: ${menu.name} with default actions to role: ${role.roleName}`
          );
        }
      });
    });

    // Convert organized object to an array and sort by order
    const result = Object.values(organized)
      .sort((a, b) => a.orderBy - b.orderBy)
      .map((mod) => ({
        ...mod,
        roles: Object.values(mod.roles), // Convert roles to an array
      }));

    console.log("📦 Organized permissions:", result);

    res.json(result); // Send the organized data back to the frontend
  } catch (err) {
    console.error("❌ Error while fetching all permissions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete permissions
const deletePermission = async (req, res) => {
  try {
    await Permission.findByIdAndDelete(req.params.id);
    res.json({ message: "Permission deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getPermissionsByRole,
  getAllPermissions,
  getPermissionById, // Added function to get permission by ID
  createOrUpdatePermission,
  deletePermission,
};
