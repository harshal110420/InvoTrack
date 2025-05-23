import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { useState } from "react";

const Sidebar = ({ moduleName, collapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { modules } = useSelector((state) => state.permission);
  // console.log("Sidebar modules:", modules);
  const [openCategory, setOpenCategory] = useState(null);

  if (!user || !modules) return null;

  const currentModule = modules.find((mod) => mod.modulePath === moduleName);

  if (!currentModule)
    return (
      <div className="p-6 text-sm text-red-600 bg-red-100 rounded-md m-4">
        🚫 No access to this module
      </div>
    );

  const modulePermissions = currentModule.menus;

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-52"
      } h-full bg-[#1F2937] text-white p-3 shadow-md overflow-y-auto transition-all duration-300 flex-shrink-0`}
    >
      {!collapsed && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold tracking-wide border-b border-gray-700 pb-2">
            {currentModule.moduleName}
          </h2>
        </div>
      )}

      <nav className="space-y-3">
        {Object.keys(modulePermissions).map((category) => {
          const categoryPermissions = modulePermissions[category];
          if (!categoryPermissions?.length) return null;

          return (
            <div key={category}>
              {!collapsed && (
                <>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex justify-between items-center px-4 py-2 rounded-md uppercase tracking-wider text-sm bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <span>{category}</span>
                    <span className="text-xs">
                      {openCategory === category ? "▲" : "▼"}
                    </span>
                  </button>

                  {openCategory === category && (
                    <ul className="mt-2 pl-4 border-l border-gray-600 space-y-1">
                      {categoryPermissions.map((subModule) => (
                        <li key={subModule.menuId}>
                          <Link
                            to={`/module/${moduleName}/${subModule.menuId}`}
                            className={`block px-2 py-2 rounded-md text-xs  hover:bg-gray-700 transition-all ${
                              location.pathname.includes(subModule.menuId)
                                ? "bg-gray-700 font-semibold"
                                : "text-gray-300"
                            }`}
                          >
                            {subModule.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
