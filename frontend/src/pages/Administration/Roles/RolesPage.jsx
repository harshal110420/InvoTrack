import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../../features/Roles/rolesSlice";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";

const RolesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles = [], loading, error } = useSelector((state) => state.roles); // ✅ fixed 'loading'
  console.log("Loading:", loading);
  console.log("Roles:", roles);
  console.log("Error:", error);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <div className="p-1 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Manage Roles</h2>
        <ButtonWrapper
          module="Administration"
          subModule="Role Management"
          permission="new"
        >
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() =>
              navigate("/module/admin-module/role_management/create")
            }
          >
            Create Role
          </button>
        </ButtonWrapper>
      </div>

      {loading && <p className="text-gray-600">Loading roles...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && roles.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Role Name</th>
                <th className="px-4 py-3 border-b text-center">Status</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 capitalize">{role.displayName}</td>
                  <td className="px-4 py-2 text-center">
                    {role.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        ✅ Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                        ❌ Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <ButtonWrapper
                      module="Administration"
                      subModule="Role Management"
                      permission="edit"
                    >
                      <button
                        onClick={() =>
                          navigate(
                            `/module/admin-module/role_management/update/${role._id}`
                          )
                        }
                        className="mr-2"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    </ButtonWrapper>

                    {/* Add Delete later if needed */}
                    {/* <ButtonWrapper ...>
                      <button className="text-red-600 hover:underline">🗑️</button>
                    </ButtonWrapper> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && roles.length === 0 && (
        <p className="text-gray-500 text-center py-4">No roles found.</p>
      )}
    </div>
  );
};

export default RolesPage;
