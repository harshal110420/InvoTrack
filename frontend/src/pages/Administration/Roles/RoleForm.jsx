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

  if (isEditMode && loading) {
    return <p className="p-4 text-gray-600">Loading role data...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditMode ? "Edit Role" : "Create New Role"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* roleName */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Slug (Internal)
            </label>
            <input
              type="text"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              disabled={isEditMode}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* displayName */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* isSystemRole */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isSystemRole"
              checked={formData.isSystemRole}
              onChange={handleChange}
              disabled
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">
              System Role (auto-created)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Role" : "Create Role"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;
