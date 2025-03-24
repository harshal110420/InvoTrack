import { rolePermissionsConfig } from "../config/rolePermissionsConfig";
import { useAuth } from "../context/AuthContext";

const ButtonWrapper = ({ module, permission, children }) => {
  const { user } = useAuth();

  const role = user?.role;

  // Hardcoded config check
  const hasPermission =
    rolePermissionsConfig?.[role]?.modules?.[module]?.includes(permission);

  if (!hasPermission) return null; // Don't render if no access

  return <>{children}</>;
};

export default ButtonWrapper;
