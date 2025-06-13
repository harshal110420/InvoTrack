/**
 * ⚠️ NOTE:
 * This page is meant for assigning/editing permissions for existing roles only.
 * No "Create New" button is shown here.
 *
 * To create a new permission entry:
 *   - First create a new Role in the Roles page.
 *   - Then it will automatically appear in this page.
 *   - Use ✏️ icon to assign permissions to it.
 */

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPermissions } from "../../../features/permissions/permissionSlice";
import { fetchRoles } from "../../../features/Roles/rolesSlice";
import PermissionsForm from "./PermissionForm";
import debounce from "lodash.debounce";
import ButtonWrapper from "../../../components/ButtonWrapper";

const PermissionsPage = () => {
  const dispatch = useDispatch();
  const { allPermissions, loading } = useSelector((state) => state.permission);
  const { roles } = useSelector((state) => state.roles);

  const [selectedRole, setSelectedRole] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllPermissions());
    dispatch(fetchRoles());
  }, [dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const filteredRoles = roles
    .map((role) => ({
      roleId: role._id,
      roleName: role.displayName || role.roleName,
    }))
    .filter((role) =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleEditClick = (role) => {
    setSelectedRole(role);
  };

  const closeForm = () => {
    setSelectedRole(null);
  };

  return (
    <div className="max-w-full px-4 py-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Permissions</h1>
      </div>

      {!selectedRole ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-[1000px] w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-1.5 text-left">Role Name</th>
                <th className="px-3 py-1.5 text-center">Actions</th>
              </tr>
              <tr className="bg-white sticky top-0 z-10 shadow-sm text-sm">
                <th className="px-3 py-1.5">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search Role Name"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, index) => (
                  <tr
                    key={role.roleId}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2">{role.roleName}</td>
                    <td className="px-3 py-2 text-center flex justify-center">
                      <ButtonWrapper
                        subModule="Permission Management"
                        permission="edit"
                      >
                        <button
                          onClick={() => handleEditClick(role)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          ✏️
                        </button>
                      </ButtonWrapper>
                    </td>
                  </tr>
                ))
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
  );
};

export default PermissionsPage;
