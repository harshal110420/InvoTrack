// src/components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // while checking token/user

  if (!user) return <Navigate to="/login" />; // not logged in

  return children;
};

export default PrivateRoute;
