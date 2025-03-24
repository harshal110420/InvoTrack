// src/components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";


const PrivateRoute = ({ children, module, permission }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // while checking token/user
  if (!user) return <Navigate to="/login" />; // not logged in

  if (module && permission) {
    const permissions =
      rolePermissionsConfig[user.role]?.modules?.[module] || [];
    if (!permissions.includes(permission)) {
      return <div className="p-4 text-red-500">🚫 Unauthorized Access</div>;
    }
  }
  return children;
};

export default PrivateRoute;
