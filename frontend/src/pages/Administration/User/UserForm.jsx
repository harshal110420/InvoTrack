import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../../features/users/userSlice";
import { fetchEnterprises } from "../../../features/Enterprises/EnterpriseSlice";
import { fetchRoles } from "../../../features/Roles/rolesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EnterpriseMultiSelectTree from "./EnterpriseMultiSelectTree";
import EnterpriseHierarchicalDropdown from "./EnterpriseHierarchicalDropdown";
import { Check, StepBack, StepForward, X } from "lucide-react";
import { getModulePathByMenu } from "../../../utils/navigation";

const initialFormData = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  role: "",
  isSuperUser: false,
  createInEnterprise: "",
  enterprises: [],
  businessName: "",
  phoneNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  taxIdentificationNumber: "",
  isActive: true,
};

// Utility to find relatives of selected enterprise
const findRelatives = (allEnterprises, selectedId) => {
  if (!selectedId) return [];

  // Step 1: Create a map for quick access
  const map = {};
  allEnterprises.forEach((e) => {
    map[e._id] = e;
  });

  const selected = map[selectedId];
  if (!selected) return [];

  // Step 2: Recursively find HEAD of selected enterprise
  let head = selected;
  while (head.parentEnterprise) {
    const parent = map[head.parentEnterprise._id];
    if (!parent) break;
    head = parent;
  }

  if (head.enterpriseType !== "HEAD") return [];

  // Step 3: Collect all enterprises under this HEAD
  const result = [];

  const collect = (currentId) => {
    const current = map[currentId];
    if (current) result.push(current);
    allEnterprises.forEach((e) => {
      if (e.parentEnterprise?._id === currentId) {
        collect(e._id);
      }
    });
  };

  collect(head._id);
  return result;
};

const steps = [
  "User Information",
  "Enterprise Access",
  "Address Information",
  "Additional Details",
];

const UserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [filteredEnterprises, setFilteredEnterprises] = useState([]);
  const [isSuperUserFlag, setIsSuperUserFlag] = useState(formData.isSuperUser);
  const modules = useSelector((state) => state.modules.list);
  const menus = useSelector((state) => state.menus.list);
  const modulePath = getModulePathByMenu("user_management", modules, menus);

  const { enterpriseList = [], loading } = useSelector(
    (state) => state.enterprise
  );
  const { roles } = useSelector((state) => state.roles);
  const { selectedUser } = useSelector((state) => state.users);

  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    dispatch(fetchEnterprises());
    dispatch(fetchRoles());

    if (id) {
      dispatch(getUserById(id));
      console.log("📌 Dispatching getUserById with:", id);
    }
  }, [dispatch, id]);

  // 2. Fetch user (edit mode only)
  useEffect(() => {
    if (isEditMode && selectedUser && Object.keys(selectedUser).length > 0) {
      console.log("🟡 Edit mode active. Selected user:", selectedUser);

      const formattedData = {
        fullName: selectedUser.fullName || "",
        email: selectedUser.email || "",
        username: selectedUser.username || "",
        password: "", // Password should not be pre-filled
        role: selectedUser.role?._id || "",
        isSuperUser: selectedUser.isSuperUser || false,
        createInEnterprise: selectedUser.createInEnterprise || "",
        enterprises: selectedUser.enterprises || [],
        businessName: selectedUser.businessName || "",
        phoneNumber: selectedUser.phoneNumber || "",
        address: {
          street: selectedUser.address?.street || "",
          city: selectedUser.address?.city || "",
          state: selectedUser.address?.state || "",
          country: selectedUser.address?.country || "",
          postalCode: selectedUser.address?.postalCode || "",
        },
        taxIdentificationNumber: selectedUser.taxIdentificationNumber || "",
        isActive: selectedUser.isActive ?? true,
      };

      console.log("✅ Form data being set:", formattedData);

      setFormData(formattedData);
    }
  }, [isEditMode, selectedUser]);

  // 3. Once user and enterpriseList are loaded, set relatives
  useEffect(() => {
    if (
      isEditMode &&
      formData.createInEnterprise &&
      enterpriseList.length > 0
    ) {
      const relatives = findRelatives(
        enterpriseList,
        formData.createInEnterprise
      );
      setFilteredEnterprises(relatives);
    }
  }, [formData.createInEnterprise, enterpriseList, isEditMode]);

  // Handle changes for basic inputs and nested address fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle multi-select tree changes
  const handleEnterpriseSelection = (selectedIds) => {
    // Prevent unchecking the createInEnterprise if it's in the list
    if (
      formData.createInEnterprise &&
      !selectedIds.includes(formData.createInEnterprise)
    ) {
      // Always keep createInEnterprise selected
      selectedIds = [...selectedIds, formData.createInEnterprise];
    }
    setFormData((prev) => ({ ...prev, enterprises: selectedIds }));
  };

  // Handle SuperUser checkbox click - clear related enterprise fields
  const handleSuperUserChange = (checked) => {
    setIsSuperUserFlag(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        isSuperUser: true,
        createInEnterprise: "",
        enterprises: [],
      }));
      setFilteredEnterprises([]);
    } else {
      setFormData((prev) => ({ ...prev, isSuperUser: false }));
    }
  };

  // Handle createInEnterprise selection change
  const handleCreateInEnterpriseChange = (val) => {
    // Reset enterprises array to only the newly selected enterprise (auto-select + disable)
    setFormData((prev) => ({
      ...prev,
      createInEnterprise: val,
      enterprises: val ? [val] : [],
    }));

    if (val) {
      const relatives = findRelatives(enterpriseList, val);
      setFilteredEnterprises(relatives);
    } else {
      setFilteredEnterprises([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isEditMode ? updateUser : createUser;
    const dataToSend = isEditMode
      ? { ...formData, id } // id is from useParams()
      : formData;

    try {
      await dispatch(action(dataToSend)).unwrap(); // proper success/error handling
      toast.success(`User ${isEditMode ? "updated" : "created"} successfully`);
      navigate(`/module/${modulePath}/user_management`);
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

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-grow max-w-full pt-5 pr-5 pl-5 pb-2 bg-white rounded-lg shadow-md"
        noValidate
      >
        {/* Title */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
            {isEditMode ? "Edit User Details" : "Create New User"}
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

        {/* Step Tabs */}

        <div className="flex-grow overflow-auto">
          {currentStep === 0 && (
            <div>
              {/* User Information Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  User Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
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
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
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
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password{" "}
                      {isEditMode ? "(Leave blank to keep unchanged)" : ""}
                      {!isEditMode && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                      {...(!isEditMode && { required: true })}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border border-gray-300 bg-white px-1.5 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-3 mt-8 md:mt-6">
                    <input
                      type="checkbox"
                      id="isSuperUser"
                      name="isSuperUser"
                      checked={formData.isSuperUser}
                      onChange={(e) => handleSuperUserChange(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isSuperUser"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Super User
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              {/* Enterprise Access Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Enterprise Access
                </h3>

                <div className="space-y-4">
                  <EnterpriseHierarchicalDropdown
                    allEnterprises={enterpriseList}
                    selectedValue={formData.createInEnterprise}
                    onChange={handleCreateInEnterpriseChange}
                    disabled={isSuperUserFlag}
                  />
                  <EnterpriseMultiSelectTree
                    allEnterprises={filteredEnterprises}
                    selectedIds={formData.enterprises}
                    onSelectionChange={handleEnterpriseSelection}
                    disabledIds={
                      formData.createInEnterprise
                        ? [formData.createInEnterprise]
                        : []
                    }
                    disabled={isSuperUserFlag}
                  />
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
          {currentStep === 3 && (
            <div>
              {/* Additional Information Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Additional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
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
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="taxIdentificationNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tax Identification Number
                    </label>
                    <input
                      type="text"
                      id="taxIdentificationNumber"
                      name="taxIdentificationNumber"
                      value={formData.taxIdentificationNumber}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-3 mt-6 md:mt-0">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isActive"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Active User
                    </label>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0}
            // className="text-sm px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 disabled:opacity-50"
            className="border-2 border-blue-400 text-xs font-semibold rounded-full text-black px-2 py-2 hover:bg-blue-400 hover:text-white disabled:opacity-50 flex items-center"
          >
            <StepBack className="w-4 h-4 mr-1" /> Back
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentStep === steps.length - 1}
            // className="text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            className="border-2 border-blue-400 text-xs font-semibold rounded-full text-black px-2 py-2 hover:bg-blue-400 hover:text-white disabled:opacity-50 flex items-center"
          >
            <StepForward className="w-4 h-4 mr-1" /> Next
          </button>
        </div> */}

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

export default UserForm;
