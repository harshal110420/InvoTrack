const express = require("express");
const router = express.Router();
const {
  createEnterprise,
  getAllEnterprises,
  getSingleEnterprise,
  updateEnterprise,
  deleteEnterprise,
} = require("../Controller/EnterpriseController");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/create", protect, isSuperAdmin, createEnterprise);
router.get("/all", protect, getAllEnterprises);
router.get("/get/:id", protect, getSingleEnterprise);
router.put("/update/:id", protect, isSuperAdmin, updateEnterprise);
router.delete("/delete/:id", protect, isSuperAdmin, deleteEnterprise);

module.exports = router;
