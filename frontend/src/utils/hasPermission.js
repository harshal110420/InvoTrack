import { rolePermissionsConfig } from "../config/rolePermissionsConfig";

export const hasPermission = (userRole, module, action) => {
  const roleConfig = rolePermissionsConfig[userRole];
  if (!roleConfig) return false;

  const modulePermissions = roleConfig.modules[module];
  if (!modulePermissions) return false;

  return modulePermissions.includes(action);
};
