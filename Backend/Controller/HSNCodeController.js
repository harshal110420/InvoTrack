const HSNCodeModel = require("../Model/SystemConfigureModel/HSNmodel");
const asyncHandler = require("express-async-handler");

// @desc    Create new HSN Code
// @route   POST /api/hsncode
// @access  Private
const createHSNCode = asyncHandler(async (req, res) => {
  const { HSNCode, taxRates } = req.body;

  const existing = await HSNCodeModel.findOne({ HSNCode });
  if (existing) {
    return res.status(400).json({ message: "HSN Code already exists." });
  }

  const hsn = await HSNCodeModel.create({ HSNCode, taxRates });

  res.status(201).json({ message: "HSN Code created successfully", hsn });
});

// @desc    Get all HSN Codes
// @route   GET /api/hsncode
// @access  Private
const getAllHSNCodes = asyncHandler(async (req, res) => {
  const hsnCodes = await HSNCodeModel.find().populate("taxRates");
  res.status(200).json({ message: "HSN Codes fetched successfully", hsnCodes });
});

// @desc    Get single HSN Code by ID
// @route   GET /api/hsncode/:id
// @access  Private
const getSingleHSNCode = asyncHandler(async (req, res) => {
  const hsnCode = await HSNCodeModel.findById(req.params.id).populate(
    "taxRates"
  );

  if (!hsnCode) {
    return res.status(404).json({ message: "HSN Code not found" });
  }

  res.status(200).json({ message: "HSN Code fetched successfully", hsnCode });
});

// @desc    Update HSN Code
// @route   PUT /api/hsncode/:id
// @access  Private
const updateHSNCode = asyncHandler(async (req, res) => {
  const hsnCode = await HSNCodeModel.findById(req.params.id);

  if (!hsnCode) {
    return res.status(404).json({ message: "HSN Code not found" });
  }

  hsnCode.HSNCode = req.body.HSNCode || hsnCode.HSNCode;
  hsnCode.taxRates = req.body.taxRates || hsnCode.taxRates;

  await hsnCode.save();
  res.status(200).json({ message: "HSN Code updated successfully", hsnCode });
});

// @desc    Delete HSN Code
// @route   DELETE /api/hsncode/:id
// @access  Private
const deleteHSNCode = asyncHandler(async (req, res) => {
  const hsnCode = await HSNCodeModel.findById(req.params.id);

  if (!hsnCode) {
    return res.status(404).json({ message: "HSN Code not found" });
  }

  await hsnCode.deleteOne();
  res.status(200).json({ message: "HSN Code deleted successfully" });
});

module.exports = {
  createHSNCode,
  getAllHSNCodes,
  getSingleHSNCode,
  updateHSNCode,
  deleteHSNCode,
};
