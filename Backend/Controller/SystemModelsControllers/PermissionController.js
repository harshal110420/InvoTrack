const Permission = require("../../Model/SystemModels/PermissionModel");
const Menu = require("../../Model/SystemModels/MenuModel"); // 👈 ADD THIS
const Module = require("../../Model/SystemModels/ModuleModel"); // 👈 ADD THIS

const VALID_ACTIONS = ["new", "edit", "view", "print", "delete", "export"];

// ✅ Get permissions for a role
const getPermissionsByRole = async (req, res) => {
  console.log("🔥 API HIT: getPermissionsByRole");
  try {
    const rawPermissions = await Permission.find({
      role: req.params.role,
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
    console.log(rawPermissions);

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
  createOrUpdatePermission,
  deletePermission,
};
