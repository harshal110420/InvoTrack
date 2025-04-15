import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchRoleById,
  createRole,
  updateRole,
} from "../../../features/Roles/roleFormSlice";

const RoleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roleId } = useParams();

  const isEditMode = Boolean(roleId);
  const { currentRole, loading } = useSelector((state) => state.roleForm);

  const [formData, setFormData] = useState({
    roleName: "",
    displayName: "",
    status: "active",
    isSystemRole: false,
  });

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchRoleById(roleId));
    }
  }, [dispatch, isEditMode, roleId]);

  useEffect(() => {
    if (isEditMode && currentRole) {
      setFormData({
        roleName: currentRole.roleName || "",
        displayName: currentRole.displayName || "",
        status: currentRole.status || "active",
        isSystemRole: currentRole.isSystemRole || false,
      });
    }
  }, [currentRole, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      roleName: formData.roleName.trim().toLowerCase().replace(/\s+/g, "_"),
    };

    if (isEditMode) {
      dispatch(updateRole({ id: roleId, data: payload }));
    } else {
      dispatch(createRole(payload));
    }

    navigate("/module/admin-module/role_management");
  };
  // 🛑 Avoid rendering form if data is loading
  if (isEditMode && loading) {
    return <p className="p-4">Loading role data...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit Role" : "Create New Role"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* roleName */}
        <div>
          <label className="block mb-1 font-medium">Role Slug (Internal)</label>
          <input
            type="text"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={isEditMode} // optional: lock this in edit mode
          />
        </div>

        {/* displayName */}
        <div>
          <label className="block mb-1 font-medium">Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* isSystemRole (disabled for manual edits) */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isSystemRole"
            checked={formData.isSystemRole}
            onChange={handleChange}
            className="h-4 w-4"
            disabled
          />
          <label className="text-sm text-gray-700">
            System Role (auto-created)
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : isEditMode ? "Update Role" : "Create Role"}
        </button>
      </form>
    </div>
  );
};

export default RoleForm;
