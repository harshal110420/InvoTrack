const EnterpriseModel = require("../Model/SystemConfigureModel/EnterPriseModel");

const mapEnterprisesByHierarchy = async (createInEnterpriseId) => {
  const allEnterprises = await EnterpriseModel.find({}).lean();

  const enterpriseMap = {};
  allEnterprises.forEach((ent) => {
    enterpriseMap[ent._id.toString()] = ent;
  });

  // 🔍 Step 1: Find HEAD by walking up the parent chain
  let current = enterpriseMap[createInEnterpriseId];
  if (!current) throw new Error("Invalid createInEnterprise ID");

  while (
    current.parentEnterprise &&
    enterpriseMap[current.parentEnterprise?.toString()]
  ) {
    current = enterpriseMap[current.parentEnterprise.toString()];
  }

  const headId = current._id.toString();

  // ✅ Step 2: Recursively collect all enterprises under this HEAD
  const result = [];

  const collectAllUnder = (parentId) => {
    result.push(parentId);
    const children = allEnterprises.filter(
      (ent) => ent.parentEnterprise?.toString() === parentId.toString()
    );
    children.forEach((child) => collectAllUnder(child._id.toString()));
  };

  collectAllUnder(headId);

  return {
    currentEnterpriseId: createInEnterpriseId,
    mappedEnterprises: result,
  };
};

module.exports = mapEnterprisesByHierarchy;
