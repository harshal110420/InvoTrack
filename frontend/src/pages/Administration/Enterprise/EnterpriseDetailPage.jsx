import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEnterpriseById } from "../../../features/Enterprises/EnterpriseSlice";
import {
  Building2,
  Mail,
  Phone,
  User2,
  BadgePercent,
  Banknote,
} from "lucide-react";

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
    <div className="max-w-full py-2 px-2 md:px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              {name}
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                {enterpriseCode}
              </span>
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              {enterpriseType.toLowerCase()} Enterprise
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Info Grid */}
      <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Info icon={<User2 />} label="Owner" value={ownerName} />
        <Info icon={<BadgePercent />} label="GST Number" value={gstNumber} />
        <Info icon={<Banknote />} label="PAN Number" value={panNumber} />
        <Info icon={<Mail />} label="Email" value={email} />
        <Info icon={<Phone />} label="Phone" value={phoneNumber} />
        <StatusInfo label="Status" isActive={isActive} />
        <Info label="Created At" value={new Date(createdAt).toLocaleString()} />
        <Info label="Updated At" value={new Date(updatedAt).toLocaleString()} />
        <div className="sm:col-span-2">
          <Info label="Address" value={formatAddress(address)} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, icon }) => (
  <div>
    <div className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-1">
      {icon && <span className="text-gray-400">{icon}</span>}
      {label}
    </div>
    <div className="text-gray-800 text-base">{value || "-"}</div>
  </div>
);

const StatusInfo = ({ label, isActive }) => (
  <div>
    <div className="text-gray-500 text-sm font-medium mb-1">{label}</div>
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  </div>
);

export default EnterpriseDetailPage;
