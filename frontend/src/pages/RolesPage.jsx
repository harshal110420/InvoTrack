import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../features/permissions/rolesSlice";
import ButtonWrapper from "../components/ButtonWrapper";

const RolesPage = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles); // ✅ fixed 'loading'
  console.log("Loading:", loading);
  console.log("Roles:", roles);
  console.log("Error:", error);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Roles</h2>

      <ButtonWrapper module="Roles" permission="create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4">
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
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td className="border px-4 py-2">{role.name}</td>
                <td className="border px-4 py-2">{role.description}</td>
                <td className="border px-4 py-2">
                  <ButtonWrapper module="Roles" permission="edit">
                    <button className="text-blue-600 hover:underline mr-2">
                      Edit
                    </button>
                  </ButtonWrapper>
                  <ButtonWrapper module="Roles" permission="delete">
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </ButtonWrapper>
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
