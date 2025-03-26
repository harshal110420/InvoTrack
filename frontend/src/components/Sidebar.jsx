import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";
import { useState } from "react";

const Sidebar = ({ moduleName }) => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;
  const formattedModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const modulePermissions = rolePermissionsConfig[role]?.modules?.[formattedModuleName];

  // console.log("Formatted Module Name:", formattedModuleName);
  // console.log("Module Permissions:", modulePermissions);

  if (!modulePermissions)
    return <div className="p-4 text-red-500">No access to this module</div>;

  // 🔹 State to track which category (Master, Transaction, Report) is open
  const [openCategory, setOpenCategory] = useState(null);

  // 🔹 Toggle dropdown open/close
  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="w-60 h-full bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold mb-4">{formattedModuleName}</h2>

      {Object.entries(modulePermissions).map(([category, subModules]) => (
        <div key={category} className="mb-2">
          {/* 🔹 Category Header - Click to Toggle */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full text-left px-4 py-2 font-semibold uppercase bg-gray-800 rounded-md hover:bg-gray-700 transition"
          >
            {category}
          </button>

          {/* 🔹 Show Submodules Only if Category is Open */}
          {openCategory === category && (
            <ul className="mt-2 pl-4">
              {Object.keys(subModules).map((subModule) => (
                <li key={subModule} className="mb-1">
                  <Link
                    to={`/module/${moduleName.toLowerCase()}/${subModule.toLowerCase()}`} // ✅ Ensure Proper URL
                    className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                      location.pathname.includes(subModule.toLowerCase())
                        ? "bg-gray-700"
                        : ""
                    }`}
                  >
                    {subModule}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
