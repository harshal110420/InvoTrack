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
import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { getModulePathByMenu } from "../../../utils/navigation";

const initialFormData = {
  parentCode: "root",
  name: "",
  module: "",
  category: "",
  menuId: "",
  isActive: true,
  orderBy: "",
};

const steps = ["Basic Info", "Module Details"];

const MenuForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const modules = useSelector((state) => state.modules.list);
  const menus = useSelector((state) => state.menus.list);
  const modulePath = getModulePathByMenu("menu_management", modules, menus);

  const [formData, setFormData] = useState(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const { menuById, loading } = useSelector((state) => state.menus);
  const { list: moduleList, loading: moduleLoading } = useSelector(
    (state) => state.modules
  );

  useEffect(() => {
    dispatch(fetchModules());
    dispatch(fetchGroupedMenus());
    if (isEditMode) {
      dispatch(fetchMenusById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isEditMode && menuById && Object.keys(menuById).length > 0) {
      setFormData({
        name: menuById.name || "",
        module: menuById.moduleId?.name || "",
        category: menuById.type || "",
        menuId: menuById.menuId || "",
        parentCode: menuById.parentCode || "root",
        isActive: menuById.isActive ?? true,
        orderBy: menuById.orderBy || "",
      });
    }
  }, [isEditMode, menuById]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedModule = moduleList.find((m) => m.name === formData.module);

    const payload = {
      name: formData.name,
      menuId: formData.menuId,
      type: formData.category,
      moduleId: selectedModule?._id,
      parentCode: formData.parentCode || "root",
      orderBy: parseInt(formData.orderBy || "0"),
      isActive: formData.isActive,
    };

    const action = isEditMode
      ? updateMenu({ id, updatedData: payload })
      : createMenu(payload);

    try {
      await dispatch(action).unwrap();
      toast.success(`Menu ${isEditMode ? "updated" : "created"} successfully`);
      navigate(`/module/${modulePath}/menu_management`);
    } catch (err) {
      console.error("❌ Menu form submission error:", err);
      const errorMsg =
        err?.message ||
        err?.error ||
        "Something went wrong. Please check the form and try again.";
      toast.error(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-grow max-w-full pt-5 pr-5 pl-5 pb-2 bg-white rounded-lg shadow-md"
        noValidate
      >
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            {isEditMode ? "Edit Menu Details" : "Create New Menu"}
          </h2>

          <div className="flex border-b border-gray-300 mb-6 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                  currentStep === index
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow overflow-auto">
          {currentStep === 0 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Menu Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="menuId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Menu ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="menuId"
                    name="menuId"
                    value={formData.menuId}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parentCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Parent Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="parentCode"
                    name="parentCode"
                    value={formData.parentCode}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="isActive"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Is Active?
                  </label>
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </section>
          )}

          {currentStep === 1 && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Module Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="module"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="module"
                    id="module"
                    value={formData.module}
                    onChange={handleChange}
                    required
                    className="w-full border p-1.5 text-sm rounded border-gray-300"
                  >
                    <option value="">-- Select Module --</option>
                    {moduleList.map((module) => (
                      <option key={module._id} value={module.name}>
                        {module.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border p-1.5 text-sm rounded border-gray-300"
                  >
                    <option value="">-- Select Category --</option>
                    <option value="Master">Master</option>
                    <option value="Transaction">Transaction</option>
                    <option value="Report">Report</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="orderBy"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order By
                  </label>
                  <input
                    type="number"
                    id="orderBy"
                    name="orderBy"
                    value={formData.orderBy}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="flex justify-end items-center gap-1.5 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border-2 border-amber-400 text-xs font-semibold rounded-full text-black px-3 py-1 hover:bg-amber-400 hover:text-white disabled:opacity-50 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className="border-2 border-green-400 text-xs font-semibold rounded-full text-black px-3 py-1 hover:bg-green-400 hover:text-white disabled:opacity-50 flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            {loading ? "Saving..." : id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;
