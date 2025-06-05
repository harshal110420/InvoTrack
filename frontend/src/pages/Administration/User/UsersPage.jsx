import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../features/users/userSlice";
import { fetchEnterprises } from "../../../features/Enterprises/EnterpriseSlice";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { PlusCircle, Pencil } from "lucide-react";
import EnterpriseDropdownTree from "./EnterpriseDropdownTree";

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userList = [], loading, error } = useSelector((state) => state.users);
  const { enterpriseList = [] } = useSelector((state) => state.enterprise);

  const [searchInputs, setSearchInputs] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [filters, setFilters] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    isActive: "",
    enterprise: "",
  });

  const debouncedSetSearch = useMemo(
    () =>
      debounce((field, value) => {
        setFilters((prev) => ({
          ...prev,
          [field]: value,
        }));
      }, 300),
    []
  );

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchEnterprises());

    return () => debouncedSetSearch.cancel();
  }, [dispatch, debouncedSetSearch]);

  const handleTextInputChange = (field, value) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    debouncedSetSearch(field, value);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesEnterprise = filters.enterprise
        ? user.createInEnterprise === filters.enterprise ||
          user.enterprises?.includes(filters.enterprise)
        : true;

      return (
        user.username.toLowerCase().includes(filters.username.toLowerCase()) &&
        user.fullName.toLowerCase().includes(filters.fullName.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.phoneNumber
          .toLowerCase()
          .includes(filters.phoneNumber.toLowerCase()) &&
        (filters.role ? user.role?.displayName === filters.role : true) &&
        (filters.isActive
          ? filters.isActive === "active"
            ? user.isActive === true
            : user.isActive === false
          : true) &&
        matchesEnterprise
      );
    });
  }, [userList, filters]);

  return (
    <div className="max-w-full px-4 py-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

        <ButtonWrapper subModule="User Management" permission="new">
          <button
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() =>
              navigate("/module/admin-module/user_management/create")
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>
        </ButtonWrapper>
      </div>

      {/* Filter by Enterprise */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700">
          Filter by Enterprise:
        </label>
        <EnterpriseDropdownTree
          enterprises={enterpriseList}
          selected={filters.enterprise}
          onChange={(val) => handleFilterChange("enterprise", val)}
        />
        <button
          onClick={() => handleFilterChange("enterprise", "")}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-[1000px] w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-3 py-1.5 text-left">Username</th>
              <th className="px-3 py-1.5 text-left">Full Name</th>
              <th className="px-3 py-1.5 text-left">Email</th>
              <th className="px-3 py-1.5 text-left">Phone</th>
              <th className="px-3 py-1.5 text-left">Role</th>
              <th className="px-3 py-1.5 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
            <tr className="bg-white sticky top-0 z-10 shadow-sm text-sm">
              {["username", "fullName", "email", "phoneNumber"].map((field) => (
                <th className="px-3 py-2" key={field}>
                  <input
                    type="text"
                    value={searchInputs[field]}
                    onChange={(e) =>
                      handleTextInputChange(field, e.target.value)
                    }
                    placeholder={`Search ${field}`}
                    className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
                  />
                </th>
              ))}
              <th className="px-3 py-2">
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
                >
                  <option value="">All Roles</option>
                  {[
                    ...new Set(
                      userList.map((u) => u.role?.displayName).filter(Boolean)
                    ),
                  ].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </th>
              <th className="px-3 py-2">
                <select
                  value={filters.isActive}
                  onChange={(e) =>
                    handleFilterChange("isActive", e.target.value)
                  }
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.fullName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phoneNumber}</td>
                  <td className="px-4 py-2">{user.role?.displayName || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <ButtonWrapper
                      subModule="User Management"
                      permission="edit"
                    >
                      <button
                        onClick={() =>
                          navigate(
                            `/module/admin-module/user_management/update/${user._id}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit User"
                      >
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                    </ButtonWrapper>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="mt-4 text-gray-600">Loading users...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  );
};

export default UsersPage;
