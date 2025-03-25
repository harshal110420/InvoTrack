// src/components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";

const PrivateRoute = ({ children, module, subModule, permission }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // while checking token/user
  if (!user) return <Navigate to="/" />; // not logged in

  if (module && subModule && permission) {
    const permissions =
      rolePermissionsConfig[user.role]?.modules?.[module]?.[subModule] || [];
    if (!permissions.includes(permission)) {
      return <div className="p-4 text-red-500">🚫 Unauthorized Access</div>;
    }
  }
  return children;
};

export default PrivateRoute;
