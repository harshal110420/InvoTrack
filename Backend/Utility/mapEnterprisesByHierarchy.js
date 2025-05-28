const EnterpriseModel = require("../Model/SystemConfigureModel/EnterPriseModel");

const mapEnterprisesByHierarchy = async (createInEnterpriseId) => {
  const current = await EnterpriseModel.findById(createInEnterpriseId).lean();
  if (!current) throw new Error("Invalid createInEnterprise ID");

  let mappedEnterprises = [];

  if (current.enterpriseType === "HEAD") {
    // HEAD → All REGIONs + BRANCHes under each regional
    const regionals = await EnterpriseModel.find({
      parentEnterprise: current._id,
      enterpriseType: "REGIONAL",
    }).lean();

    const regionalIds = regionals.map((r) => r._id);

    const branches = await EnterpriseModel.find({
      parentEnterprise: { $in: regionalIds },
      enterpriseType: "BRANCH",
    }).lean();

    mappedEnterprises = [...regionalIds, ...branches.map((b) => b._id)];
  } else if (current.enterpriseType === "REGIONAL") {
    // REGIONAL → Its HEAD + its BRANCHes + sibling REGIONs
    const head = await EnterpriseModel.findById(
      current.parentEnterprise
    ).lean();
    const branches = await EnterpriseModel.find({
      parentEnterprise: current._id,
      enterpriseType: "BRANCH",
    }).lean();

    const siblings = await EnterpriseModel.find({
      parentEnterprise: current.parentEnterprise,
      enterpriseType: "REGIONAL",
      _id: { $ne: current._id },
    }).lean();

    mappedEnterprises = [
      ...(head ? [head._id] : []),
      ...branches.map((b) => b._id),
      ...siblings.map((s) => s._id),
    ];
  } else if (current.enterpriseType === "BRANCH") {
    // BRANCH → Its REGIONAL + Its HEAD + sibling BRANCHes
    const regional = await EnterpriseModel.findById(
      current.parentEnterprise
    ).lean();

    if (regional) {
      const head = await EnterpriseModel.findById(
        regional.parentEnterprise
      ).lean();
      const siblingBranches = await EnterpriseModel.find({
        parentEnterprise: regional._id,
        enterpriseType: "BRANCH",
        _id: { $ne: current._id },
      }).lean();

      mappedEnterprises = [
        regional._id,
        ...(head ? [head._id] : []),
        ...siblingBranches.map((b) => b._id),
      ];
    }
  }

  return {
    currentEnterpriseId: current._id,
    mappedEnterprises,
  };
};

module.exports = mapEnterprisesByHierarchy;
