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

const UserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [filteredEnterprises, setFilteredEnterprises] = useState([]);

  const {
    enterpriseList = [],
  } = useSelector((state) => state.enterprise);
  const { roles } = useSelector((state) => state.roles);
  const { selectedUser } = useSelector((state) => state.users);
  console.log("selectedUser:", selectedUser);
  // Log the initial state of enterpriseList and roles
  // 1. Fetch roles & enterprises ONLY once
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

  useEffect(() => {
    console.log("Fetched selectedUser from store:", selectedUser);
  }, [selectedUser]);

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
    console.log("🔍 Final formData on submit:", formData); // 🔥 Add this
    const dataToSend = isEditMode
      ? { ...formData, id } // id is from useParams()
      : formData;

    console.log("🔍 Final formData on submit:", dataToSend); // Updated data
    try {
      await dispatch(action(dataToSend)).unwrap(); // proper success/error handling
      toast.success(`User ${isEditMode ? "updated" : "created"} successfully`);
      navigate("/module/admin-module/user_management");
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
    <form
      onSubmit={handleSubmit}
      className="max-w-full p-5 bg-white rounded-lg shadow-md space-y-8"
      noValidate
    >
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
        {isEditMode ? "Edit User Details" : "Create New User"}
      </h2>

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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password {isEditMode ? "(Leave blank to keep unchanged)" : ""}
              {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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

      {/* Enterprise Access Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
          Enterprise Access
        </h3>

        <div className="space-y-4">
          {/* <label
            htmlFor="createInEnterprise"
            className="block text-sm font-medium text-gray-700"
          >
            Create In Enterprise
          </label> */}
          <EnterpriseHierarchicalDropdown
            allEnterprises={enterpriseList}
            selectedValue={formData.createInEnterprise}
            onChange={handleCreateInEnterpriseChange}
            disabled={formData.isSuperUser}
          />

          {/* <label
            htmlFor="enterprises"
            className="block text-sm font-medium text-gray-700 mt-6"
          >
            Assigned Enterprises
          </label> */}
          <EnterpriseMultiSelectTree
            allEnterprises={filteredEnterprises}
            selectedIds={formData.enterprises}
            onSelectionChange={handleEnterpriseSelection}
            disabledIds={
              formData.createInEnterprise ? [formData.createInEnterprise] : []
            }
            disabled={formData.isSuperUser}
          />
        </div>
      </section>

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
                className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          ))}
        </div>
      </section>

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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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
              className="block w-full rounded-md border border-gray-300 px-1 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
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

      {/* Submit and Cancel Buttons */}
      <section className="pt-6 flex justify-end space-x-4 border-t">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
        >
          {isEditMode ? "Update User" : "Create User"}
        </button>
      </section>
    </form>
  );
};

export default UserForm;
