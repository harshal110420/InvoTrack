import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPermissions } from "../../../features/permissions/permissionSlice";
import { fetchRoles } from "../../../features/Roles/rolesSlice"; // ✅ Import this
import PermissionsForm from "./PermissionForm";

const PermissionsPage = () => {
  const dispatch = useDispatch();
  const { allPermissions, loading } = useSelector((state) => state.permission);
  const { roles } = useSelector((state) => state.roles); // ✅ Roles from Redux
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPermissions());
    dispatch(fetchRoles()); // ✅ Fetch all roles on load
  }, [dispatch]);

  const handleEditClick = (role) => {
    setSelectedRole(role);
  };

  const closeForm = () => {
    setSelectedRole(null);
  };

  const uniqueRolesById = roles.map((role) => ({
    roleId: role._id,
    roleName: role.displayName || role.roleName, // prefer displayName for UI
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Role Permissions Management
        </h1>

        {!selectedRole ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm">
              <thead className="bg-gray-100 text-gray-900 uppercase text-sm">
                <tr>
                  <th className="p-3 text-left border border-gray-300">
                    Role Name
                  </th>
                  <th className="p-3 text-left border border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {uniqueRolesById.length > 0 ? (
                  uniqueRolesById.map((role) => (
                    <tr
                      key={role.roleId}
                      className="hover:bg-blue-50 transition duration-150"
                    >
                      <td className="p-3 border border-gray-200">
                        {role.roleName}
                      </td>
                      <td className="p-3 border border-gray-200">
                        <button
                          onClick={() => handleEditClick(role)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition duration-200"
                        >
                          Edit Permissions
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="p-4 border border-gray-200 text-center text-gray-500"
                    >
                      No roles available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="animate-fade-in">
            <PermissionsForm selectedRole={selectedRole} onClose={closeForm} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsPage;
