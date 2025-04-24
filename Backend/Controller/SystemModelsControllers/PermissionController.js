const Permission = require("../../Model/SystemModels/PermissionModel");
const Menu = require("../../Model/SystemModels/MenuModel");
const Module = require("../../Model/SystemModels/ModuleModel");
const role = require("../../Model/SystemConfigureModel/RoleModel");
const VALID_ACTIONS = ["new", "edit", "view", "print", "delete", "export"];

// ✅ Get permissions for a role
const getPermissionsByRole = async (req, res) => {
  console.log("🔥 API HIT: getPermissionsByRole");
  try {
    // ✅ Step 1: Find Role ObjectId using name
    const roleDoc = await role.findOne({ roleName: req.params.role });
    console.log("🧠 Finding Role by name:", req.params.role);

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
    console.log("🎯 Permissions fetched:", rawPermissions.length);

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

    // ✅ Step 1: Input validation
    if (!role || !menuId || !Array.isArray(actions)) {
      return res.status(400).json({
        error: "Fields 'role', 'menuId', and 'actions[]' are required.",
      });
    }

    // ✅ Step 2: Check if actions are valid
    const invalidActions = actions.filter(
      (action) => !VALID_ACTIONS.includes(action)
    );
    if (invalidActions.length > 0) {
      return res.status(400).json({
        error: `Invalid actions found: ${invalidActions.join(", ")}`,
      });
    }

    // ✅ Step 3: Fetch existing permission
    let permission = await Permission.findOne({ role, menuId });

    // ✅ User ID from logged-in user or fallback
    const userId = req.user?._id || "system";

    if (permission) {
      // 🔁 If permission exists, handle update based on actionType
      if (actionType === "add") {
        permission.actions = [...new Set([...permission.actions, ...actions])];
      } else if (actionType === "remove") {
        permission.actions = permission.actions.filter(
          (action) => !actions.includes(action)
        );
      } else {
        // default: replace
        permission.actions = actions;
      }

      permission.updatedBy = userId;
      await permission.save();
    } else {
      // ⚠️ If trying to remove on non-existing permission
      if (actionType === "remove") {
        return res.status(400).json({
          error: "Cannot remove actions from a non-existent permission.",
        });
      }

      // ✅ Create new permission
      permission = new Permission({
        role,
        menuId,
        actions,
        createdBy: userId,
      });

      await permission.save();
    }

    return res.status(201).json({
      message: "Permission saved successfully",
      permission,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

// ✅ Get all permissions (across all roles)
const getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await Permission.find()
      .populate({
        path: "menuId",
        populate: {
          path: "moduleId",
          model: "Module",
        },
      })
      .populate("role", "displayName") // ✅ Add this line to populate role details
      .lean();

    const organized = {};

    allPermissions.forEach((perm) => {
      const module = perm.menuId?.moduleId;
      const menu = perm.menuId;
      const role = perm.role;

      if (!module || !menu) return; // Skip incomplete data

      const moduleId = module._id.toString();
      const menuId = menu._id.toString();
      const roleId = role._id.toString(); // ✅ Correctly use _id as key

      // Initialize module if not present
      if (!organized[moduleId]) {
        organized[moduleId] = {
          moduleName: module.name,
          modulePath: module.path,
          orderBy: module.orderBy || 99,
          roles: {}, // role-wise permissions
        };
      }

      // Initialize role under this module
      if (!organized[moduleId].roles[roleId]) {
        organized[moduleId].roles[roleId] = {
          roleId,
          roleName: role.displayName,
          permissions: [],
        };
      }

      // Add permission entry
      organized[moduleId].roles[roleId].permissions.push({
        menuName: menu.name,
        menuType: menu.type,
        menuId,
        actions: perm.actions,
      });
    });

    const result = Object.values(organized)
      .sort((a, b) => a.orderBy - b.orderBy)
      .map((mod) => ({
        ...mod,
        roles: Object.values(mod.roles),
      }));

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
