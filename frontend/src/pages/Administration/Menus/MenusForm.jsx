import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMenu,
  updateMenu,
  resetMenuStatus,
} from "../../../features/menus/menuSlice";
import { fetchModules } from "../../../features/Modules/ModuleSlice";
import { useNavigate, useParams } from "react-router-dom";

const initialFormData = {
  name: "",
  module: "",
  category: "",
  menuId: "",
  isActive: true,
  orderBy: "",
};

const MenuForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // for edit

  const [formData, setFormData] = useState(initialFormData);

  const {
    createSuccess,
    updateSuccess,
    loading,
    error,
    list: menuList,
  } = useSelector((state) => state.menus);

  const { list: moduleList, loading: moduleLoading } = useSelector(
    (state) => state.modules
  );

  // 🔽 Fetch modules on load
  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  // 🔽 Handle edit mode
  useEffect(() => {
    if (id) {
      const menuToEdit = menuList.find((m) => m.id === id);
      if (menuToEdit) {
        setFormData({
          name: menuToEdit.name,
          module: menuToEdit.module,
          category: menuToEdit.category,
          menuId: menuToEdit.menuId,
          isActive: menuToEdit.isActive,
          orderBy: menuToEdit.orderBy || "",
        });
      }
    }
  }, [id, menuList]);

  // 🔽 Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateMenu({ id, updatedData: formData }));
    } else {
      dispatch(createMenu(formData));
    }
  };

  // 🔽 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔽 Navigate on success
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(resetMenuStatus());
      navigate("/menus"); // Change path as per your route
    }
  }, [createSuccess, updateSuccess, dispatch, navigate]);

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit" : "Create"} Menu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Menu Name */}
        <div>
          <label className="block text-gray-700 mb-1">Menu Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter menu name"
          />
        </div>

        {/* Module Dropdown */}
        <div>
          <label className="block text-gray-700 mb-1">Module</label>
          <select
            name="module"
            value={formData.module}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Module --</option>
            {moduleLoading && <option>Loading...</option>}
            {moduleList.map((mod) => (
              <option key={mod._id} value={mod.name}>
                {mod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Category --</option>
            <option value="Master">Master</option>
            <option value="Transaction">Transaction</option>
            <option value="Report">Report</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Menu ID</label>
          <input
            type="text"
            name="menuId"
            value={formData.menuId}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter unique menu ID (e.g., accountmaster)"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Order By</label>
          <input
            type="number"
            name="orderBy"
            value={formData.orderBy}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter order number for sorting"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
            className="w-4 h-4"
          />
          <label className="text-gray-700">Is Active?</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : id ? "Update Menu" : "Create Menu"}
        </button>

        {/* Error */}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default MenuForm;
