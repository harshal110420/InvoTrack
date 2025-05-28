import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, getUserById } from "../../../features/users/userSlice";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userList = [], loading, error } = useSelector((state) => state.users);

  // Local state for inputs
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
  });

  // Debounce setup
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
    return () => {
      debouncedSetSearch.cancel(); // cleanup on unmount
    };
  }, [debouncedSetSearch]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
          : true)
      );
    });
  }, [userList, filters]);

  return (
    <div className="max-w-7xl px-2 sm:px-3 lg:px-3 py-2 font-sans h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          User Management
        </h2>
        <ButtonWrapper subModule="User Management" permission="new">
          <button
            className="bg-blue-600 text-sm hover:bg-blue-700 text-white px-2 py-1.5 rounded-md transition"
            onClick={() =>
              navigate("/module/admin-module/user_management/create")
            }
          >
            Create User
          </button>
        </ButtonWrapper>
      </div>

      {loading && <p className="text-gray-600">Loading users...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && (
        <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200">
          <table className="min-w-[900px] w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-3 py-1.5 text-left">Username</th>
                <th className="px-3 py-1.5 text-left">Full Name</th>
                <th className="px-3 py-1.5 text-left">Email</th>
                <th className="px-3 py-1.5 text-left">Phone</th>
                <th className="px-3 py-1.5 text-left">Role</th>
                <th className="px-3 py-1.5 text-left">Status</th>
                <th className="px-3 py-1.5 text-center">Actions</th>
              </tr>
              <tr className="bg-white text-gray-600 text-xs">
                {["username", "fullName", "email", "phoneNumber"].map(
                  (field) => (
                    <th className="px-3 py-1.5" key={field}>
                      <input
                        type="text"
                        value={searchInputs[field]}
                        onChange={(e) =>
                          handleTextInputChange(field, e.target.value)
                        }
                        placeholder={`Search ${field}`}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                      />
                    </th>
                  )
                )}
                <th className="px-3 py-1.5">
                  <select
                    value={filters.role}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
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
                <th className="px-3 py-1.5">
                  <select
                    value={filters.isActive}
                    onChange={(e) =>
                      handleFilterChange("isActive", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
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
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2">{user.username}</td>
                    <td className="px-3 py-2">{user.fullName}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.phoneNumber}</td>
                    <td className="px-3 py-2">
                      {user.role?.displayName || "-"}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <ButtonWrapper
                        subModule="User Management"
                        permission="edit"
                      >
                        <button
                          onClick={() => {
                            dispatch(getUserById(user._id));
                            navigate(`/admin/users/${user._id}`);
                          }}
                          title="View/Edit User"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                      </ButtonWrapper>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
