import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPermissions,
  savePermission,
  resetPermissions,
} from "../../../features/permissions/permissionSlice";
import { ChevronDown, ChevronRight } from "lucide-react";

const actionList = ["view", "new", "edit", "delete", "print", "export"];

const PermissionForm = ({ selectedRole, onClose }) => {
  const dispatch = useDispatch();
  const { allPermissions: permissions, loading } = useSelector(
    (state) => state.permission
  );

  // Log permissions data fetched from the slice
  console.log("Menus permission check from API:", permissions);

  const [expandedModules, setExpandedModules] = useState({});
  const [localPermissions, setLocalPermissions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedRole) {
      console.log("Fetching permissions for selectedRole:", selectedRole);
      dispatch(fetchAllPermissions(selectedRole));
    }
  }, [selectedRole, dispatch]);

  useEffect(() => {
    if (permissions && Array.isArray(permissions)) {
      const transformed = {};

      permissions.forEach((module) => {
        const moduleName = module.moduleName;
        transformed[moduleName] = {};

        // Get the permissions from the first role (you mentioned roles[0] always present)
        const modulePermissions = module.roles?.[0]?.permissions || [];

        modulePermissions.forEach((perm) => {
          const menuId =
            typeof perm.menuId === "object" ? perm.menuId._id : perm.menuId;

          const name = perm.menuName || perm.menuId?.name || "Unnamed Menu";

          const type = perm.menuType || "Other";

          transformed[moduleName][menuId] = {
            name,
            type,
            actions: perm.actions || [], // even if empty, show it
          };
        });
      });

      setLocalPermissions(transformed);
    }
  }, [permissions]);

  const toggleModule = (moduleName) => {
    console.log(`Toggling module: ${moduleName}`);
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleCheckboxChange = (module, menuId, action) => {
    console.log(
      `Checkbox change: Module=${module}, MenuID=${menuId}, Action=${action}`
    );
    setLocalPermissions((prev) => {
      const current = prev?.[module]?.[menuId]?.actions || [];
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action];

      console.log("Updated actions:", updated);

      return {
        ...prev,
        [module]: {
          ...prev[module],
          [menuId]: {
            ...prev[module][menuId],
            actions: updated,
          },
        },
      };
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Submitting permissions...");
    const requests = [];

    Object.entries(localPermissions).forEach(([moduleName, menus]) => {
      Object.entries(menus).forEach(([menuId, menuData]) => {
        const { actions } = menuData;
        if (actions && actions.length > 0) {
          console.log("Submitting permission:", {
            role: selectedRole,
            menuId, // menuId should now be an ObjectId
            actions,
            typeofMenuId: typeof menuId,
            isValidObjectId: /^[0-9a-fA-F]{24}$/.test(menuId),
          });
          requests.push(
            dispatch(
              savePermission({
                role: selectedRole.roleName,
                menuId, // Correctly use ObjectId here
                actions,
                actionType: "replace", // or "add"/"remove" as needed
              })
            )
          );
        }
      });
    });

    try {
      await Promise.all(requests);
      console.log("Permissions successfully updated.");
      // dispatch(resetPermissions());
      await dispatch(fetchAllPermissions(selectedRole)); // Refetch latest permissions

      onClose(); // Close form after all updates are successful
    } catch (err) {
      console.error("Permission update error:", err);
    }
  };

  const filterMenus = (menus) =>
    Object.entries(menus).filter(([_, menu]) =>
      menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading || !selectedRole) return <p className="p-4">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="pb-4">
        <input
          type="text"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Permission Tables */}
      {Object.entries(localPermissions).map(([moduleName, menus]) => (
        <div
          key={moduleName}
          className="border border-gray-300 rounded-xl overflow-hidden shadow-sm"
        >
          <div
            onClick={() => toggleModule(moduleName)}
            className="flex justify-between items-center bg-gray-100 px-5 py-3 cursor-pointer hover:bg-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {moduleName}
            </h2>
            {expandedModules[moduleName] ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </div>

          {expandedModules[moduleName] && (
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 border-b font-medium">
                      Menu
                    </th>
                    <th className="text-left py-3 px-4 border-b font-medium">
                      Type
                    </th>
                    {actionList.map((action) => (
                      <th
                        key={action}
                        className="text-center py-3 px-2 border-b font-medium capitalize"
                      >
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filterMenus(menus).map(
                    ([menuId, { name, type, actions }]) => (
                      <tr key={menuId} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-gray-800">
                          {name}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-600 capitalize">
                          {type}
                        </td>
                        {actionList.map((action) => (
                          <td key={action} className="text-center border-b">
                            <input
                              type="checkbox"
                              checked={actions?.includes(action)}
                              onChange={() =>
                                handleCheckboxChange(moduleName, menuId, action)
                              }
                              className="w-4 h-4 accent-blue-600"
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-md"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default PermissionForm;
