import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "../features/permissions/permissionSlice";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import EnterpriseSwitcherPanel from "../components/EnterpriseSwitcherPanel"; // ✅ Step 1

const Dashboard = () => {
  const { user, selectedEnterprise, updateEnterprise, handleLogout } =
    useAuth(); // ✅ Step 2
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { modules, loading } = useSelector((state) => state.permission);

  useEffect(() => {
    if (user?.role) {
      dispatch(fetchPermissions(user.role));
    }
  }, [user, dispatch]);

  if (!user) return null;

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // ✅ Correct state name
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">InvoTrack</div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            {user.fullName}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
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
      <div className="p-6 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h1 className="text-2xl font-bold">Welcome, {user.fullName}!</h1>
          <EnterpriseSwitcherPanel />
        </div>

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
