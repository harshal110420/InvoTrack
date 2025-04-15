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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

      <ButtonWrapper
        module="Administration"
        subModule="Role Management"
        permission="new"
      >
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
          onClick={() => navigate("/module/admin-module/role_management/create")}
        >
          + Create Role
        </button>
      </ButtonWrapper>

      {/* Loading / Error */}
      {loading && <p>Loading roles...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Roles Table */}
      {!loading && roles.length > 0 && (
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Role Name</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td className="border px-4 py-2 capitalize">
                  {role.displayName}
                </td>
                <td className="border px-4 py-2 text-center">
                  {role.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Inactive
                    </span>
                  )}
                </td>

                <td className="border px-4 py-2">
                  <ButtonWrapper
                    module="Administration"
                    subModule="Role Management"
                    permission="edit"
                  >
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => navigate(`/module/admin-module/role_management/update/${role._id}`)}
                    >
                      Edit
                    </button>
                  </ButtonWrapper>
                  {/* <ButtonWrapper
                    module="Administration"
                    subModule="Role Management"
                    permission="delete"
                  >
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </ButtonWrapper> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No roles message */}
      {!loading && roles.length === 0 && (
        <p className="text-gray-500">No roles found.</p>
      )}
    </div>
  );
};

export default RolesPage;
