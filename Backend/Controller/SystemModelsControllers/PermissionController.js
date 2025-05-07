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

    const allPermissions = await Permission.find()
      .populate({
        path: "menuId",
        populate: { path: "moduleId", model: "Module" },
      })
      .populate("role", "displayName")
      .lean();

    const allMenus = await Menu.find()
      .populate("moduleId", "name path orderBy")
      .lean();

    const organized = {};

    // Step 1: Structure from permissions
    allPermissions.forEach((perm) => {
      const module = perm.menuId?.moduleId;
      const menu = perm.menuId;
      const role = perm.role;

      if (!module || !menu) {
        console.log("⚠️ Skipping permission due to missing module/menu data.");
        return;
      }

      const moduleId = module._id.toString();
      const menuId = menu._id.toString();
      const roleId = role._id.toString();

      if (!organized[moduleId]) {
        organized[moduleId] = {
          moduleName: module.name,
          modulePath: module.path,
          orderBy: module.orderBy || 99,
          menus: [],
          roles: {},
        };
      }

      if (!organized[moduleId].roles[roleId]) {
        organized[moduleId].roles[roleId] = {
          roleId,
          roleName: role.displayName,
          permissions: [],
        };
      }

      organized[moduleId].roles[roleId].permissions.push({
        menuId,
        menuName: menu.name,
        menuType: menu.type,
        actions: perm.actions,
      });
    });

    // Step 2: Ensure menus[] is filled for each module, including new menus
    allMenus.forEach((menu) => {
      const module = menu.moduleId;
      if (!module) return;

      const moduleId = module._id.toString();

      // Init module if not already done
      if (!organized[moduleId]) {
        organized[moduleId] = {
          moduleName: module.name,
          modulePath: module.path,
          orderBy: module.orderBy || 99,
          menus: [],
          roles: {},
        };
      }

      const menuData = {
        _id: menu._id.toString(),
        name: menu.name,
        type: menu.type,
      };

      // Avoid duplicate menu push
      const exists = organized[moduleId].menus.find(
        (m) => m._id === menuData._id
      );
      if (!exists) {
        organized[moduleId].menus.push(menuData);
      }

      // Add this menu with empty actions to all existing roles if missing
      Object.values(organized[moduleId].roles).forEach((role) => {
        const alreadyHas = role.permissions.find(
          (p) => p.menuId === menu._id.toString()
        );
        if (!alreadyHas) {
          role.permissions.push({
            menuId: menu._id.toString(),
            menuName: menu.name,
            menuType: menu.type,
            actions: [],
          });
        }
      });
    });

    // Step 3: Convert organized map to array and sort
    const result = Object.values(organized)
      .sort((a, b) => a.orderBy - b.orderBy)
      .map((mod) => ({
        ...mod,
        roles: Object.values(mod.roles),
      }));

    console.log("📦 Final structured permissions ready for frontend");
    res.json(result);
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
