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
    <div className="max-w-7xl px-2 sm:px-3 lg:px-3 py-2 font-sans h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Manage Permissions
        </h2>
      </div>

      {!selectedRole ? (
        <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-[600px] w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-1.5 text-left">Role Name</th>
                <th className="px-3 py-1.5 text-center">Actions</th>
              </tr>
              <tr className="bg-white text-gray-600 text-xs">
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
