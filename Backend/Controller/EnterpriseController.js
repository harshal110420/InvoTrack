const asyncHandler = require("express-async-handler");
const EnterpriseModel = require("../Model/SystemConfigureModel/EnterPriseModel");

// @desc    Create new enterprise
// @route   POST /api/enterprise
// @access  Private (authmiddleware)
const createEnterprise = asyncHandler(async (req, res) => {
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
    enterpriseType,
    parentEnterprise,
  } = req.body;

  // Check for duplicate code
  const existing = await EnterpriseModel.findOne({ enterpriseCode });
  if (existing) {
    return res.status(400).json({ message: "Enterprise code already exists" });
  }

  // Validate parentEnterprise if not HEAD
  if (enterpriseType !== "HEAD" && !parentEnterprise) {
    return res.status(400).json({
      message: "Parent enterprise is required for REGIONAL or BRANCH type.",
    });
  }

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
    enterpriseType,
    parentEnterprise,
  });

  res
    .status(201)
    .json({ message: "Enterprise created successfully", enterprise });
});

// @desc    Get all enterprises (with parent info populated)
// @route   GET /api/enterprise
// @access  Private
const getAllEnterprises = asyncHandler(async (req, res) => {
  const enterprises = await EnterpriseModel.find().populate(
    "parentEnterprise",
    "name enterpriseCode enterpriseType"
  );
  res.status(200).json({ enterprises });
});

// @desc    Get single enterprise by ID
// @route   GET /api/enterprise/:id
// @access  Private
const getEnterpriseById = asyncHandler(async (req, res) => {
  const enterprise = await EnterpriseModel.findById(req.params.id).populate(
    "parentEnterprise",
    "name enterpriseCode enterpriseType"
  );

  if (!enterprise) {
    return res.status(404).json({ message: "Enterprise not found" });
  }

  res.status(200).json({ enterprise });
});

// @desc    Update enterprise
// @route   PUT /api/enterprise/:id
// @access  Private
const updateEnterprise = asyncHandler(async (req, res) => {
  const enterprise = await EnterpriseModel.findById(req.params.id);

  if (!enterprise) {
    return res.status(404).json({ message: "Enterprise not found" });
  }

  const {
    name,
    ownerName,
    email,
    phoneNumber,
    gstNumber,
    panNumber,
    address,
    isActive,
    enterpriseType,
    parentEnterprise,
  } = req.body;

  // Update fields
  enterprise.name = name || enterprise.name;
  enterprise.ownerName = ownerName || enterprise.ownerName;
  enterprise.email = email || enterprise.email;
  enterprise.phoneNumber = phoneNumber || enterprise.phoneNumber;
  enterprise.gstNumber = gstNumber || enterprise.gstNumber;
  enterprise.panNumber = panNumber || enterprise.panNumber;
  enterprise.address = address || enterprise.address;
  enterprise.isActive = isActive !== undefined ? isActive : enterprise.isActive;

  if (enterpriseType) enterprise.enterpriseType = enterpriseType;
  if (parentEnterprise !== undefined)
    enterprise.parentEnterprise = parentEnterprise;

  const updated = await enterprise.save();

  res
    .status(200)
    .json({ message: "Enterprise updated successfully", enterprise: updated });
});

// @desc    Delete enterprise
// @route   DELETE /api/enterprise/:id
// @access  Private
const deleteEnterprise = asyncHandler(async (req, res) => {
  const enterprise = await EnterpriseModel.findById(req.params.id);

  if (!enterprise) {
    return res.status(404).json({ message: "Enterprise not found" });
  }

  await enterprise.deleteOne();
  res.status(200).json({ message: "Enterprise deleted successfully" });
});

// @desc    Get enterprises by parent enterprise
// @route   GET /api/enterprise/by-parent/:parentId
// @access  Private
const getEnterprisesByParent = asyncHandler(async (req, res) => {
  const enterprises = await EnterpriseModel.find({
    parentEnterprise: req.params.parentId,
  });
  res.status(200).json({ enterprises });
});

// Recursive function
const fetchChildren = async (parentId) => {
  const children = await EnterpriseModel.find({ parentEnterprise: parentId });

  const result = await Promise.all(
    children.map(async (child) => {
      const subChildren = await fetchChildren(child._id); // recursion
      return {
        ...child.toObject(),
        children: subChildren,
      };
    })
  );

  return result;
};

// Main controller
const getEnterpriseTreeById = async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    const parent = await EnterpriseModel.findById(enterpriseId);

    if (!parent) {
      return res.status(404).json({ message: "Enterprise not found" });
    }

    const children = await fetchChildren(parent._id);

    const tree = {
      ...parent.toObject(),
      children,
    };

    res.status(200).json(tree);
  } catch (error) {
    console.error("Error fetching enterprise tree:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createEnterprise,
  getAllEnterprises,
  getEnterpriseById,
  updateEnterprise,
  deleteEnterprise,
  getEnterprisesByParent,
  getEnterpriseTreeById,
};
