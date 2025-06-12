export const getFallbackEnterpriseId = (user) => {
  return (
    user.selectedEnterprise || // ✅ include this!
    user.lastLoggedInEnterprise?._id ||
    user.createInEnterprise?._id ||
    user.enterprises?.[0]?._id ||
    null
  );
};
