import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMenu,
  updateMenu,
  resetMenuStatus,
  fetchGroupedMenus,
  fetchMenusById,
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
  const isEditMode = Boolean(id); // check if we are in edit mode
  const [formData, setFormData] = useState(initialFormData);
  const { menuById } = useSelector((state) => state.menus);
  // console.log("menuById:", menuById);

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

  useEffect(() => {
    dispatch(fetchModules());

    if (id) {
      // console.log("📌 Dispatching fetchMenusById with:", id);
      dispatch(fetchMenusById(id));
    }

    dispatch(fetchGroupedMenus());
  }, [dispatch, id]);

  // 🔽 Handle edit mode
  useEffect(() => {
    if (isEditMode && menuById && Object.keys(menuById).length > 0) {
      setFormData({
        name: menuById.name || "",
        module: menuById.moduleId?.name || "", // Use moduleId.name if it's an object
        category: menuById.type || "",
        menuId: menuById.menuId || "",
        isActive: menuById.isActive ?? true,
        orderBy: menuById.orderBy || "",
      });
    }
  }, [isEditMode, menuById]);

  useEffect(() => {
    console.log("Fetched menuById from store:", menuById);
  }, [menuById]);

  // 🔽 Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedModule = moduleList.find((m) => m.name === formData.module);
    const payload = {
      name: formData.name,
      menuId: formData.menuId,
      type: formData.category, // category is same as backend's "type"
      moduleId: selectedModule?._id, // 💡 must be ObjectId, not name
      parentCode: "root", // defaulting to root for now
      orderBy: parseInt(formData.orderBy || "0"), // assuming orderBy is optional
      isActive: formData.isActive,
    };
    if (id) {
      dispatch(updateMenu({ id, updatedData: payload }));
    } else {
      console.log("Form Data Being Submitted: ", payload);
      dispatch(createMenu(payload));
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
      navigate("/module/system-module/menu_management"); // Change path as per your route
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
