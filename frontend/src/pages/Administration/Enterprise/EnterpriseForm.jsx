import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEnterprise,
  updateEnterprise,
  getEnterpriseById,
  clearSelectedEnterprise,
  fetchEnterprises,
} from "../../../features/Enterprises/EnterpriseSlice";
import { useNavigate, useParams } from "react-router-dom";

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

const EnterpriseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);

  const {
    createSuccess,
    updateSuccess,
    loading,
    error,
    enterpriseById,
    list: enterpriseList,
  } = useSelector((state) => state.enterprise);

  useEffect(() => {
    dispatch(fetchEnterprises());
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      isEditMode &&
      enterpriseById &&
      Object.keys(enterpriseById).length > 0
    ) {
      setFormData({
        enterpriseCode: enterpriseById.enterpriseCode || "",
        name: enterpriseById.name || "",
        ownerName: enterpriseById.ownerName || "",
        email: enterpriseById.email || "",
        phoneNumber: enterpriseById.phoneNumber || "",
        gstNumber: enterpriseById.gstNumber || "",
        panNumber: enterpriseById.panNumber || "",
        address: enterpriseById.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        enterpriseType: enterpriseById.enterpriseType || "",
        parentEnterprise: enterpriseById.parentEnterprise?._id || "",
        isActive: enterpriseById.isActive ?? true,
      });
    }
  }, [isEditMode, enterpriseById]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };

    if (id) {
      dispatch(updateEnterprise({ id, updatedData: payload }));
    } else {
      dispatch(createEnterprise(payload));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      dispatch(clearSelectedEnterprise());
      navigate("/module/system-module/enterprise_management");
    }
  }, [createSuccess, updateSuccess, dispatch, navigate]);

  const renderEnterpriseOption = (enterprise, level = 0) => {
    return (
      <option key={enterprise._id} value={enterprise._id}>
        {"—".repeat(level)} {enterprise.name}
      </option>
    );
  };

  //   const renderHierarchicalOptions = (list, parentId = null, level = 0) => {
  //     return list
  //       .filter((ent) => {
  //         const pid = ent.parentEnterprise?._id || null;
  //         return pid === parentId;
  //       })
  //       .flatMap((ent) => [
  //         renderEnterpriseOption(ent, level),
  //         ...renderHierarchicalOptions(list, ent._id, level + 1),
  //       ]);
  //   };

  return (
    <div className="max-w-full bg-white p-3  rounded-xl ">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        {id ? "Edit" : "Create"} Enterprise
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4  p-2 rounded-md mt-4 border border-gray-200 shadow-sm bg-gray-100"
      >
        {/*Enterprise Code */}
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Enterprise Code
          </label>
          <input
            type="text"
            name="enterpriseCode"
            value={formData.enterpriseCode}
            onChange={handleChange}
            required
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        {/* Name */}
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Enterprise Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Owner Name
          </label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Email
          </label>
          <input
            type="email"
            name="phoneNumber"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            GST Number
          </label>
          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            PAN Number
          </label>
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Street
          </label>
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, street: e.target.value },
              }))
            }
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, city: e.target.value },
              }))
            }
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, state: e.target.value },
              }))
            }
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.address.country}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, country: e.target.value },
              }))
            }
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.address.postalCode}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, postalCode: e.target.value },
              }))
            }
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Enterprise Type
          </label>
          <select
            name="enterpriseType"
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

        {/* Parent Enterprise */}
        {/* <div>
          <label className="block text-gray-600 text-base font-semibold mb-0.5">
            Parent Enterprise (Optional)
          </label>
          <select
            name="parentEnterprise"
            value={formData.parentEnterprise}
            onChange={handleChange}
            className="w-full border p-1.5 text-sm rounded border-gray-300"
          >
            <option value="">-- No Parent (HEAD level) --</option>
            {renderHierarchicalOptions(enterpriseList)}
          </select>
        </div> */}
        {/* Is Active */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleCheckbox}
            className="w-4 h-4"
          />
          <label className="text-gray-700">Is Active?</label>
        </div>

        {/* Submit */}
        <div className="flex justify-end items-center gap-1.5 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)} // assuming you're using react-router
            className="border-2 border-amber-400 text-xs font-semibold rounded-full text-black px-2 py-1  hover:bg-amber-400 hover:text-white disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="border-2 border-green-400 text-xs font-semibold rounded-full text-black px-2 py-1  hover:bg-green-400 hover:text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : id
              ? "Update"
              : "Submit"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default EnterpriseForm;
