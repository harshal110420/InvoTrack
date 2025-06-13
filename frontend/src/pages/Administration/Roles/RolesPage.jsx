import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../features/Roles/rolesSlice";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { PlusCircle } from "lucide-react";

const RolesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles = [], loading, error } = useSelector((state) => state.roles);

  const [searchInput, setSearchInput] = useState(""); // raw input
  const [searchRoleName, setSearchRoleName] = useState(""); // debounced filter
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // 🔁 Debounce function setup
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchRoleName(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const filteredRoles = roles.filter((role) => {
    const matchesName = role.displayName
      .toLowerCase()
      .includes(searchRoleName.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : role.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <div className="max-w-full px-4 py-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Roles</h1>
        <ButtonWrapper subModule="Role Management" permission="new">
          <button
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => navigate("/module/admin-module/role_management/create")}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>
        </ButtonWrapper>
      </div>

      {loading && <p className="text-gray-600">Loading roles...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-[1000px] w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-1.5 text-left">Role Name</th>
                <th className="px-3 py-1.5 text-left">Status</th>
                <th className="px-3 py-1.5 text-center">Actions</th>
              </tr>
              <tr className="bg-white sticky top-0 z-10 shadow-sm text-sm">
                <th className="px-3 py-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search Role Name"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  />
                </th>
                <th className="px-3 py-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role, index) => (
                  <tr
                    key={role._id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      {role.displayName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          role.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {role.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center flex justify-center gap-3">
                      <ButtonWrapper
                        subModule="Role Management"
                        permission="edit"
                      >
                        <button
                          onClick={() =>
                            navigate(
                              `/module/admin-module/role_management/update/${role._id}`
                            )
                          }
                          title="Edit Role"
                          className="text-blue-600 hover:text-blue-800"
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
      )}
    </div>
  );
};

export default RolesPage;
