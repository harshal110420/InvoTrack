import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";
import { useState } from "react";

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const role = user?.role;
  const roleModules = rolePermissionsConfig[role]?.modules || {};

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
              <div className="p-4 text-sm text-gray-700 border-b">{user.email}</div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="p-6 flex-grow">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.fullName}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(roleModules).map((moduleName) => (
            <Link
              key={moduleName}
              to={`/module/${moduleName.toLowerCase()}`}
              className="bg-white p-6 shadow-md rounded-xl hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold">{moduleName} Module</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
