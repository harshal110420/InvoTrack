const EnterpriseModel = require("../Model/SystemConfigureModel/EnterPriseModel");
const asyncHandler = require("express-async-handler");

// @desc Create new enterprise
// @route POST /api/enterprise
// @access Private (Only super_admin can create an enterprise)
const createEnterprise = asyncHandler(async (req, res) => {
  try {
    const {
      enterpriseCode,
      name,
      ownerName,
      email,
      phoneNumber,
      gstNumber,
      panNumber,
      address,
      isActive,
    } = req.body;

    // Ensure required fields are provided
    if (!gstNumber) {
      return res.status(400).json({ message: "GST number is required." });
    }

    // Check if an enterprise with the given GST number already exists
    const enterpriseExists = await EnterpriseModel.findOne({ gstNumber });
    if (enterpriseExists) {
      return res.status(400).json({
        message: "Enterprise with this GST number already exists.",
      });
    }

    // Create new enterprise
    const enterprise = await EnterpriseModel.create({
      enterpriseCode,
      name,
      ownerName,
      email,
      phoneNumber,
      gstNumber,
      panNumber,
      address,
      isActive: isActive !== undefined ? isActive : true,
    });

    res
      .status(201)
      .json({ message: "Enterprise created successfully", enterprise });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc Get all enterprises
// @route GET /api/enterprise
// @access Private (Only super_admin access)
const getAllEnterprises = asyncHandler(async (req, res) => {
  try {
    const enterprises = await EnterpriseModel.find();
    res
      .status(200)
      .json({ message: "Enterprises fetched successfully", enterprises });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc Get single enterprise by ID
// @route GET /api/enterprise/:id
// @access Private (Only super_admin access)
const getSingleEnterprise = asyncHandler(async (req, res) => {
  try {
    const enterprise = await EnterpriseModel.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found." });
    }
    res.status(200).json({ message: "Enterprise found", enterprise });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc Update enterprise
// @route PUT /api/enterprise/:id
// @access Private (Only super_admin access)
const updateEnterprise = asyncHandler(async (req, res) => {
  try {
    const enterprise = await EnterpriseModel.findById(req.params.id);

    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    // Update fields only if they exist in the request body
    if (req.body.enterpriseCode !== undefined) {
      enterprise.enterpriseCode = req.body.enterpriseCode;
    }
    if (req.body.name !== undefined) {
      enterprise.name = req.body.name;
    }
    if (req.body.ownerName !== undefined) {
      enterprise.ownerName = req.body.ownerName;
    }
    if (req.body.email !== undefined) {
      enterprise.email = req.body.email;
    }
    if (req.body.phoneNumber !== undefined) {
      enterprise.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.gstNumber !== undefined) {
      enterprise.gstNumber = req.body.gstNumber;
    }
    if (req.body.panNumber !== undefined) {
      enterprise.panNumber = req.body.panNumber;
    }
    if (req.body.address !== undefined) {
      enterprise.address = req.body.address;
    }
    if (req.body.isActive !== undefined) {
      enterprise.isActive = req.body.isActive;
    }

    // Save updated enterprise
    await enterprise.save();
    res
      .status(200)
      .json({ message: "Enterprise updated successfully", enterprise });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc Delete an enterprise
// @route DELETE /api/enterprise/:id
// @access Private (Only super_admin access)
const deleteEnterprise = asyncHandler(async (req, res) => {
  try {
    const enterprise = await EnterpriseModel.findById(req.params.id);
    if (!enterprise) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    await enterprise.deleteOne();
    res.status(200).json({ message: "Enterprise deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = {
  createEnterprise,
  getAllEnterprises,
  getSingleEnterprise,
  updateEnterprise,
  deleteEnterprise,
};
