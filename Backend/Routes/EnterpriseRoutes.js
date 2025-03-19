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
const { authmiddleware } = require("../middleware/authMiddleware");

// Routes
router.post("/create", authmiddleware, isSuperAdmin, createEnterprise);
router.get("/all", authmiddleware, getAllEnterprises);
router.get("/get/:id", authmiddleware, getSingleEnterprise);
router.put("/update/:id", authmiddleware, isSuperAdmin, updateEnterprise);
router.delete("/delete/:id", authmiddleware, isSuperAdmin, deleteEnterprise);

module.exports = router;
