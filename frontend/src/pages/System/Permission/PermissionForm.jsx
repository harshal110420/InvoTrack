import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPermissions,
  savePermission,
  resetPermissions,
  fetchPermissions,
} from "../../../features/permissions/permissionSlice";
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";

const actionList = ["view", "new", "edit", "delete", "print", "export"];

const PermissionForm = ({ selectedRole, onClose }) => {
  const dispatch = useDispatch();
  const { allPermissions: permissions, loading } = useSelector(
    (state) => state.permission
  );

  // Log permissions data fetched from the slice
  console.log("Menus permission check from API:", permissions);

  const [expandedModules, setExpandedModules] = useState({});
  const [expandedTypes, setExpandedTypes] = useState({});
  const [localPermissions, setLocalPermissions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      console.log("Fetching permissions for selectedRole:", selectedRole);
      dispatch(fetchAllPermissions());
    }
  }, [selectedRole, dispatch]);

  useEffect(() => {
    if (permissions && Array.isArray(permissions)) {
      const transformed = {};

      permissions.forEach((module) => {
        const moduleName = module.moduleName;
        transformed[moduleName] = {};

        const rolePermissions =
          module.roles?.find((r) => r.roleName === selectedRole.roleName)
            ?.permissions || [];

        // Convert assigned permissions to a map for faster lookup
        const assignedMap = {};
        rolePermissions.forEach((perm) => {
          const menuId =
            typeof perm.menuId === "object" ? perm.menuId._id : perm.menuId;
          assignedMap[menuId] = perm.actions || [];
        });

        // Now iterate through all menus in the module
        module.menus?.forEach((menu) => {
          const menuId = typeof menu._id === "object" ? menu._id._id : menu._id;
          transformed[moduleName][menuId] = {
            name: menu.name || "Unnamed Menu",
            type: menu.type || "Other",
            actions: assignedMap[menuId] || [], // if not assigned, keep it empty
          };
        });
      });

      setLocalPermissions(transformed);
    }
  }, [permissions]);

  useEffect(() => {
    const checkChanges = () => {
      const original = JSON.stringify(permissions);
      const current = JSON.stringify(localPermissions);
      setHasChanges(original !== current);
    };

    checkChanges();
  }, [localPermissions, permissions]);

  const toggleModule = (moduleName) => {
    console.log(`Toggling module: ${moduleName}`);
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const toggleType = (moduleName, type) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [moduleName]: {
        ...prev[moduleName],
        [type]: !prev?.[moduleName]?.[type],
      },
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
    setIsSubmitting(true);
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
      toast.success("Permissions updated successfully!");
      // ✅ Refetch all for localPermissions view
      await dispatch(fetchAllPermissions(selectedRole));

      // ✅ Optional: Also fetch single-role permissions if needed
      await dispatch(fetchPermissions(selectedRole.roleName));

      onClose(); // Close form after all updates are successful
    } catch (err) {
      console.error("Permission update error:", err);
      toast.error("Failed to update permissions!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterMenus = (menus) =>
    Object.entries(menus).filter(([_, menu]) =>
      menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    const hasDiff =
      JSON.stringify(permissions) !== JSON.stringify(localPermissions);
    setHasChanges(hasDiff);
  }, [permissions, localPermissions]);

  if (loading || !selectedRole) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-500 text-sm">
          Loading permissions, please wait...
        </p>
      </div>
    );
  }

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
              {["Master", "Transaction", "Report"].map((typeKey) => {
                const menusOfType = filterMenus(menus).filter(
                  ([_, menu]) =>
                    menu.type?.toLowerCase() === typeKey.toLowerCase()
                );
                if (menusOfType.length === 0) return null;

                return (
                  <div key={typeKey} className="border-t">
                    {/* Type Header */}
                    <div
                      onClick={() => toggleType(moduleName, typeKey)}
                      className="flex justify-between items-center bg-gray-50 px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <h3 className="font-semibold text-gray-700">{typeKey}</h3>
                      {expandedTypes?.[moduleName]?.[typeKey] ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </div>

                    {/* Table Content */}
                    {expandedTypes?.[moduleName]?.[typeKey] && (
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr>
                            <th className="text-left py-2 px-4 border-b">
                              Menu
                            </th>
                            <th className="text-left py-2 px-4 border-b">
                              Type
                            </th>
                            {actionList.map((action) => (
                              <th
                                key={action}
                                className="text-center py-2 px-2 border-b capitalize"
                              >
                                {action}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {menusOfType.map(
                            ([menuId, { name, type, actions }]) => (
                              <tr key={menuId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-gray-800">
                                  {name}
                                </td>
                                <td className="py-2 px-4 border-b text-gray-600 capitalize">
                                  {type}
                                </td>
                                {actionList.map((action) => (
                                  <td
                                    key={action}
                                    className="text-center border-b"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={actions?.includes(action)}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          moduleName,
                                          menuId,
                                          action
                                        )
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
                    )}
                  </div>
                );
              })}
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
          disabled={!hasChanges}
          className={`px-6 py-2 rounded-lg text-white text-sm font-medium transition shadow-md ${
            hasChanges
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default PermissionForm;
