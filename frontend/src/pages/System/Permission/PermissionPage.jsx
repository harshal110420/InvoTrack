import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPermissions } from "../../../features/permissions/permissionSlice";
import PermissionsForm from "./PermissionForm";

const PermissionsPage = () => {
  const dispatch = useDispatch();
  const { allPermissions, loading } = useSelector((state) => state.permission);
  const [selectedRole, setSelectedRole] = useState(null); // Store full role object

  useEffect(() => {
    dispatch(fetchAllPermissions());
  }, [dispatch]);

  const handleEditClick = (role) => {
    setSelectedRole(role); // Store the entire role (roleId + roleName)
  };

  const closeForm = () => {
    setSelectedRole(null);
  };

  // Extract unique roles from allPermissions
  const uniqueRoles = Array.from(
    new Map(
      allPermissions
        .flatMap((module) => module.roles)
        .map((role) => [
          role.roleId,
          { roleId: role.roleId, roleName: role.roleName },
        ])
    ).values()
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Permissions</h1>

      {!selectedRole ? (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Role Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uniqueRoles.map((role) => (
              <tr key={role.roleId}>
                <td className="p-2 border">{role.roleName}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEditClick(role)}
                    className="px-4 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <PermissionsForm
          selectedRole={selectedRole.roleName} // Only pass roleName
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default PermissionsPage;
