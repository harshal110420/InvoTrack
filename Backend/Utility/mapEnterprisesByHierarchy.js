const EnterpriseModel = require("../Model/SystemConfigureModel/EnterPriseModel");

const mapEnterprisesByHierarchy = async (createInEnterpriseId) => {
  const currentEnterprise = await EnterpriseModel.findById(createInEnterpriseId).lean();
  if (!currentEnterprise) throw new Error("Invalid createInEnterprise ID");

  let mappedEnterprises = [];

  if (currentEnterprise.enterpriseType === "HEAD") {
    const regionals = await EnterpriseModel.find({
      parentEnterprise: currentEnterprise._id,
      enterpriseType: "REGIONAL",
    }).lean();
    const regionalIds = regionals.map((r) => r._id);

    const branches = await EnterpriseModel.find({
      parentEnterprise: { $in: regionalIds },
      enterpriseType: "BRANCH",
    }).lean();

    mappedEnterprises = [...regionalIds, ...branches.map((b) => b._id)];

  } else if (currentEnterprise.enterpriseType === "REGIONAL") {
    const head = currentEnterprise.parentEnterprise;
    const branches = await EnterpriseModel.find({
      parentEnterprise: currentEnterprise._id,
      enterpriseType: "BRANCH",
    }).lean();

    mappedEnterprises = [head, ...branches.map((b) => b._id)];

  } else if (currentEnterprise.enterpriseType === "BRANCH") {
    const regional = await EnterpriseModel.findById(currentEnterprise.parentEnterprise).lean();
    if (regional) {
      const head = regional.parentEnterprise;
      mappedEnterprises = [regional._id, head];
    }
  }

  return { currentEnterpriseId: currentEnterprise._id, mappedEnterprises };
};

module.exports = mapEnterprisesByHierarchy;
