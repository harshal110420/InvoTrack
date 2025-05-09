const express = require("express");
const router = express.Router();
const {
  createEnterprise,
  getAllEnterprises,
  getEnterpriseById,
  updateEnterprise,
  deleteEnterprise,
  getEnterprisesByParent, // ✅ NEW
  // getEnterpriseTree, // ✅ OPTIONAL: Full hierarchy tree
  getEnterpriseTreeById,
} = require("../Controller/EnterpriseController");

const isSuperAdmin = require("../middleware/isSuperAdmin");
const authmiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/create", authmiddleware, createEnterprise);
router.get("/all", authmiddleware, getAllEnterprises);
router.get("/get/:id", authmiddleware, getEnterpriseById);
router.put("/update/:id", authmiddleware, updateEnterprise);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deleteEnterprise);

// ✅ NEW: Get all enterprises under a parent (e.g., show all branches of a regional)
router.get("/by-parent/:parentId", authmiddleware, getEnterprisesByParent);

// ✅ BONUS: Get full enterprise hierarchy tree (HEAD -> REGIONAL -> BRANCH)
// router.get("/tree", authmiddleware, getEnterpriseTreeById); // optional, can skip for now
router.get("/tree/:enterpriseId", authmiddleware, getEnterpriseTreeById);
module.exports = router;
