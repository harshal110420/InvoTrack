import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEnterprise,
  updateEnterprise,
  getEnterpriseById,
  resetEnterpriseStatus,
  fetchEnterprises,
} from "../../../features/Enterprises/EnterpriseSlice";
import { useNavigate, useParams } from "react-router-dom";
import EnterpriseDropdownTree from "./EnterpriseDropdownTree";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

const initialFormData = {
  enterpriseCode: "",
  name: "",
  ownerName: "",
  email: "",
  phoneNumber: "",
  gstNumber: "",
  panNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  enterpriseType: "", // HEAD | REGIONAL | BRANCH
  parentEnterprise: "", // should be _id or ""
  isActive: true,
};

const steps = [
  "Basic Information",
  "Contact & Legal Details",
  "Address Information",
];

const EnterpriseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const {
    selectedEnterprise,
    createSuccess,
    updateSuccess,
    loading,
    error,
    enterpriseList,
  } = useSelector((state) => state.enterprise);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    dispatch(fetchEnterprises());
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      isEditMode &&
      selectedEnterprise &&
      Object.keys(selectedEnterprise).length > 0
    ) {
      setFormData({
        enterpriseCode: selectedEnterprise.enterpriseCode || "",
        name: selectedEnterprise.name || "",
        ownerName: selectedEnterprise.ownerName || "",
        email: selectedEnterprise.email || "",
        phoneNumber: selectedEnterprise.phoneNumber || "",
        gstNumber: selectedEnterprise.gstNumber || "",
        panNumber: selectedEnterprise.panNumber || "",
        address: selectedEnterprise.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        enterpriseType: selectedEnterprise.enterpriseType || "",
        parentEnterprise: selectedEnterprise.parentEnterprise?._id || "",
        isActive: selectedEnterprise.isActive ?? true,
      });
    }
  }, [isEditMode, selectedEnterprise]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const payload = { ...formData };
  //   if (id) {
  //     dispatch(updateEnterprise({ id, updatedData: payload }));
  //   } else {
  //     dispatch(createEnterprise(payload));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isEditMode ? updateEnterprise : createEnterprise;
    const dataToSend = isEditMode
      ? { ...formData, id } // id is from useParams()
      : formData;

    try {
      await dispatch(action(dataToSend)).unwrap(); // proper success/error handling
      toast.success(`User ${isEditMode ? "updated" : "created"} successfully`);
      navigate("/module/admin-module/enterprise_management");
    } catch (err) {
      console.error("❌ User form submission error:", err);

      // Backend se agar proper message aaye to dikhao
      const errorMsg =
        err?.message ||
        err?.error ||
        "Something went wrong. Please check the form and try again.";

      toast.error(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "enterpriseType" && { parentEnterprise: "" }), // Reset on type change
    }));
  };

  const handleCheckbox = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
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
            {isEditMode ? "Edit Enterprise Details" : "Create New Enterprise"}
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
            <div>
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="enterpriseCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enterprise code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="enterpriseCode"
                      name="enterpriseCode"
                      value={formData.enterpriseCode}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enterprise Name <span className="text-red-500">*</span>
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
                      htmlFor="enterpriseType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Enterprise type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="enterpriseType"
                      id="enterpriseType"
                      value={formData.enterpriseType}
                      onChange={handleChange}
                      required
                      className="w-full border p-1.5 text-sm rounded border-gray-300"
                    >
                      <option value="">-- Select Type --</option>
                      <option value="HEAD">HEAD</option>
                      <option value="REGIONAL">REGIONAL</option>
                      <option value="BRANCH">BRANCH</option>
                    </select>
                  </div>
                  <div>
                    {formData.enterpriseType !== "HEAD" && (
                      <EnterpriseDropdownTree
                        enterpriseList={enterpriseList}
                        enterpriseType={formData.enterpriseType} // NEW LINE
                        value={formData.parentEnterprise}
                        onChange={(selectedId) =>
                          setFormData((prev) => ({
                            ...prev,
                            parentEnterprise: selectedId,
                          }))
                        }
                      />
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Is Active? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleCheckbox}
                      className="w-6 h-6"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Contact & Legal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="ownerName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gstNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      GST Number
                    </label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="panNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      PAN Number
                    </label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              {/* Address Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Street", name: "address.street" },
                    { label: "City", name: "address.city" },
                    { label: "State", name: "address.state" },
                    { label: "Country", name: "address.country" },
                    { label: "Postal Code", name: "address.postalCode" },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {label}
                      </label>
                      <input
                        type="text"
                        id={name}
                        name={name}
                        value={
                          name.includes("address.")
                            ? formData.address[name.split(".")[1]]
                            : formData[name]
                        }
                        onChange={handleChange}
                        className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
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

export default EnterpriseForm;
