import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEnterpriseById } from "../../../features/Enterprises/EnterpriseSlice";

const EnterpriseDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedEnterprise, loading } = useSelector(
    (state) => state.enterprise
  );

  useEffect(() => {
    if (id) {
      dispatch(getEnterpriseById(id));
    }
  }, [id, dispatch]);

  if (loading || !selectedEnterprise) {
    return (
      <div className="p-10 text-center text-gray-500 text-base">
        {loading ? "Loading enterprise details..." : "No enterprise found."}
      </div>
    );
  }

  const {
    enterpriseCode,
    name,
    enterpriseType,
    ownerName,
    email,
    phoneNumber,
    address,
    panNumber,
    gstNumber,
    isActive,
    createdAt,
    updatedAt,
  } = selectedEnterprise;

  const formatAddress = (addr) => {
    if (!addr) return "-";
    const { street, city, state, country, postalCode } = addr;
    return [street, city, state, country, postalCode]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-8 bg-white border border-gray-200 shadow-md rounded-2xl">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
            🏢 {name}
            <span className="text-sm bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded">
              {enterpriseCode}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {enterpriseType} Enterprise
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
        <Detail label="Owner" value={ownerName} />
        <Detail label="GST Number" value={gstNumber} />
        <Detail label="PAN Number" value={panNumber} />
        <Detail label="Email" value={email} />
        <Detail label="Phone Number" value={phoneNumber} />
        <Detail
          label="Status"
          value={
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          }
        />
        <Detail
          label="Created At"
          value={new Date(createdAt).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(updatedAt).toLocaleString()}
        />
        <div className="sm:col-span-2">
          <Detail label="Address" value={formatAddress(address)} />
        </div>
      </div>
    </div>
  );
};

// 🔹 Subcomponent to keep structure clean
const Detail = ({ label, value }) => (
  <div>
    <div className="text-gray-500 font-medium mb-1">{label}</div>
    <div className="text-gray-800">{value || "-"}</div>
  </div>
);

export default EnterpriseDetailPage;
