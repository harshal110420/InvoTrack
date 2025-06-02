export const getRelativesOfEnterprise = (selectedId, enterpriseList) => {
  const map = {};
  enterpriseList.forEach((ent) => {
    map[ent._id] = ent;
  });

  const resultSet = new Set();

  const addRelatives = (id) => {
    const current = map[id];
    if (!current) return;

    resultSet.add(id);

    // Add parent
    const parent = current.parentEnterprise?._id;
    if (parent) resultSet.add(parent);

    // Add siblings
    enterpriseList.forEach((ent) => {
      if (ent.parentEnterprise?._id === parent && ent._id !== id) {
        resultSet.add(ent._id);
      }
    });

    // Add children + grandchildren
    const addChildrenRecursive = (parentId) => {
      enterpriseList.forEach((ent) => {
        if (ent.parentEnterprise?._id === parentId) {
          resultSet.add(ent._id);
          addChildrenRecursive(ent._id);
        }
      });
    };
    addChildrenRecursive(id);
  };

  addRelatives(selectedId);
  return enterpriseList.filter((ent) => resultSet.has(ent._id));
};
