import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";

const Dashboard = () => {
  const { user, handleLogout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const role = user?.role;
  const roleModules = rolePermissionsConfig[role]?.modules || {};
  if (loading) return <div className="p-4 text-lg">Loading dashboard...</div>;

  if (!user) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.fullName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(roleModules).map((moduleName) => (
          <Link
            key={moduleName}
            to={`/${moduleName.toLowerCase()}`}
            className="bg-white p-4 shadow rounded-xl hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold">{moduleName} Module</h3>
            <p className="text-sm text-gray-500">
              Access: {roleModules[moduleName].join(", ")}
            </p>
          </Link>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleLogoutClick}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
