const TaxConfigModel = require("../Model/SystemConfigureModel/RateconfigModel");
const asyncHandler = require("express-async-handler");

// @desc    Create a new tax configuration
// @route   POST /api/tax-config
// @access  Private (Only super_admin can create)

const createTaxConfig = asyncHandler(async (req, res) => {
  const { GSTRateName, IGST, CGST, SGST, UGST } = req.body;

  const existingTax = await TaxConfigModel.findOne({
    GSTRateName: GSTRateName.lowercase(),
  });
  if (existingTax) {
    return res.status(400).json({ message: "Tax rate name already exists" });
  }
  const taxConfig = await TaxConfigModel.create({
    GSTRateName: GSTRateName.lowercase(),
    IGST,
    CGST,
    SGST,
    UGST: UGST || null,
  });

  if (taxConfig) {
    res.status(200).json({ message: "Tax configuration created", taxConfig });
  } else {
    res.status(400).json({ message: "Invalid tax configuration data" });
  }
});

// @desc    Get all tax configurations
// @route   GET /api/tax-config
// @access  Private
const getAllTaxConfigs = asyncHandler(async (req, res) => {
  const taxConfigs = await TaxConfigModel.find();
  res.status(200).json(taxConfigs);
});

// @desc    Get a single tax configuration by ID
// @route   GET /api/tax-config/:id
// @access  Private
const getTaxConfigByID = asyncHandler(async (req, res) => {
  const taxConfig = await TaxConfigModel.findById(req.params.id);
  if (!taxConfig) {
    return res.status(404).json({ message: "Tax configuration not found" });
  }
  res.status(200).json(taxConfig);
});

// @desc    Update a tax configuration
// @route   PUT /api/tax-config/:id
// @access  Private
const updateTaxConfig = asyncHandler(async (req, res) => {
  const taxConfig = await TaxConfigModel.findById(req.params.id);

  if (!taxConfig) {
    return res.status(404).json({ message: "Tax configuration not found" });
  }

  // ✅ Validate and Update Fields Properly
  if (req.body.GSTRateName) taxConfig.GSTRateName = req.body.GSTRateName;

  if (req.body.IGST !== undefined) taxConfig.IGST = req.body.IGST;
  if (req.body.CGST !== undefined) taxConfig.CGST = req.body.CGST;
  if (req.body.SGST !== undefined) taxConfig.SGST = req.body.SGST;
  if (req.body.UGST !== undefined) taxConfig.UGST = req.body.UGST;

  if (typeof req.body.isActive === "boolean") {
    taxConfig.isActive = req.body.isActive;
  }

  await taxConfig.save();
  res.status(200).json({ message: "Tax configuration updated", taxConfig });
});

// @desc    Delete a tax configuration
// @route   DELETE /api/tax-config/:id
// @access  Private
const deleteTaxConfig = asyncHandler(async (req, res) => {
  const taxConfig = await TaxConfigModel.findById(req.params.id);
  if (!taxConfig) {
    return res.status(404).json({ message: "Tax configuration not found" });
  }

  await taxConfig.deleteOne();
  res.status(200).json({ message: "Tax configuration deleted" });
});

module.exports = {
  createTaxConfig,
  getAllTaxConfigs,
  getTaxConfigByID,
  updateTaxConfig,
  deleteTaxConfig,
};
