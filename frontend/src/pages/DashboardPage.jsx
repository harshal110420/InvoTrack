import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../features/permissions/permissionSlice";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { modules, loading } = useSelector((state) => state.permission);

  useEffect(() => {
    if (user?.role) {
      console.log("Dispatching permission fetch for role:", user.role);
      dispatch(fetchPermissions(user.role)).then((res) => {
        console.log("👀 Permissions Fetched:", res);
      });
    }
  }, [user, dispatch]);
  console.log("User:", user);
  console.log("Modules from Redux:", modules);
  if (!user) return null;

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">InvoTrack</div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            {user.fullName}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 text-sm text-gray-700 border-b">
                {user.email}
              </div>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Content */}
      {/* Dashboard Content */}
      <div className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.fullName}!</h1>

        {loading ? (
          <div>Loading modules...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Link
                key={module.modulePath}
                to={`/module/${module.modulePath}`}
                className="bg-white p-6 shadow-md rounded-xl hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold">
                  {module.moduleName} Module
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
