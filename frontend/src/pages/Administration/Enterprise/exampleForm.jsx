return (
  <div className="flex flex-col h-full">
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-grow max-w-full pt-5 pr-5 pl-5 pb-2 bg-white rounded-lg shadow-md"
      noValidate
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
          {isEditMode ? "Edit Role Details" : "Create New Role"}
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
                    htmlFor="roleName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role name{" "}
                    <span className="text-red-500">
                      *Use underscore (_) instead of space
                    </span>
                  </label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    value={formData.roleName}
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
                    Is Active? <span className="text-red-500">*</span>
                  </label>
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
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
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

// old menu form code
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

// return (

//   <div className="flex flex-col h-full">
//     <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         {isEditMode ? "Edit Role" : "Create New Role"}
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* roleName */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Role Slug (Internal)
//           </label>
//           <input
//             type="text"
//             name="roleName"
//             value={formData.roleName}
//             onChange={handleChange}
//             disabled={isEditMode}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//           />
//         </div>

//         {/* displayName */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Display Name
//           </label>
//           <input
//             type="text"
//             name="displayName"
//             value={formData.displayName}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {/* isSystemRole */}
//         <div className="flex items-center space-x-3">
//           <input
//             type="checkbox"
//             name="isSystemRole"
//             checked={formData.isSystemRole}
//             onChange={handleChange}
//             disabled
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//           />
//           <label className="text-sm text-gray-700">
//             System Role (auto-created)
//           </label>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
//         >
//           {loading ? "Saving..." : isEditMode ? "Update Role" : "Create Role"}
//         </button>
//       </form>
//     </div>
//   </div>
// );
