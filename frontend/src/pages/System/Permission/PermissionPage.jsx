import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPermissions } from "../../../features/permissions/permissionSlice";
import PermissionsForm from "./PermissionForm";

const PermissionsPage = () => {
  const dispatch = useDispatch();
  const { allPermissions, loading } = useSelector((state) => state.permission);
  const [selectedRole, setSelectedRole] = useState(null); // Store full role object

  console.log("All Permissions from Redux:", allPermissions);

  useEffect(() => {
    // Fetch all permissions and menus on component mount
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  const handleEditClick = (role) => {
    setSelectedRole(role); // Store the entire role (roleId + roleName)
  };

  const closeForm = () => {
    setSelectedRole(null);
  };

  // Extract unique roles from allPermissions, but now properly flatten roles from each module
  const uniqueRoles = Array.isArray(allPermissions)
    ? allPermissions.flatMap((module) =>
        module.roles.map((role) => ({
          roleId: role.roleId,
          roleName: role.roleName,
        }))
      )
    : [];

  // Remove duplicates by roleId
  const uniqueRolesById = Array.from(
    new Map(
      uniqueRoles.map((role) => [
        role.roleId, // Use roleId to avoid duplicates
        { roleId: role.roleId, roleName: role.roleName }, // Create a new object for unique roles
      ])
    ).values()
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Permissions</h1>

      {/* Display the role table if no role is selected */}
      {!selectedRole ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Role Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate over the unique roles to display them in the table */}
            {uniqueRolesById.length > 0 ? (
              uniqueRolesById.map((role) => (
                <tr key={role.roleId}>
                  <td className="p-2 border">{role.roleName}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleEditClick(role)} // Set the selected role
                      className="px-4 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-2 border text-center">
                  No roles available for permissions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        // Pass the full role object (roleName + roleId) to PermissionsForm
        <PermissionsForm
          selectedRole={selectedRole} // Pass the full role object
          onClose={closeForm} // Close the form when done
        />
      )}
    </div>
  );
};

export default PermissionsPage;
