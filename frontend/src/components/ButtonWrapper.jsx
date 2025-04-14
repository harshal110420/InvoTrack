import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

const ButtonWrapper = ({ module, subModule, permission, children }) => {
  const { user } = useAuth();
  const role = user?.role;

  const { modules } = useSelector((state) => state.permission);

  // If no permission state loaded yet
  if (!modules || !modules[module]) return null;

  const subPermissions = modules[module]?.[subModule] || [];

  const hasPermission = subPermissions.includes(permission);

  if (!hasPermission) return null;

  return <>{children}</>;
};

export default ButtonWrapper;
