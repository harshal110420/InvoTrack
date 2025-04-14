import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { useState } from "react";

const Sidebar = ({ moduleName }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { modules } = useSelector((state) => state.permission);

  if (!user || !modules) return null;

  // 🔍 Find the current module using modulePath
  const currentModule = modules.find((mod) => mod.modulePath === moduleName);

  if (!currentModule)
    return <div className="p-4 text-red-500">🚫 No access to this module</div>;

  const modulePermissions = currentModule.menus;
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="w-60 h-full bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold mb-4">{currentModule.moduleName}</h2>

      {/* 🔁 Dynamic category rendering based on backend response */}
      {Object.keys(modulePermissions).map((category) => {
        const categoryPermissions = modulePermissions[category];

        if (!categoryPermissions || categoryPermissions.length === 0)
          return null;

        return (
          <div key={category} className="mb-2">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full text-left px-4 py-2 font-semibold uppercase bg-gray-800 rounded-md hover:bg-gray-700 transition"
            >
              {category}
            </button>

            {openCategory === category && (
              <ul className="mt-2 pl-4">
                {categoryPermissions.map((subModule) => (
                  <li key={subModule.menuId} className="mb-1">
                    <Link
                      to={`/module/${moduleName}/${subModule.menuId}`}
                      className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                        location.pathname.includes(subModule.menuId)
                          ? "bg-gray-700"
                          : ""
                      }`}
                    >
                      {subModule.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
