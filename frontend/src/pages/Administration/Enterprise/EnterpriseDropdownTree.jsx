import React, { useState, useRef, useEffect } from "react";

const EnterpriseDropdownTree = ({ enterpriseList = [], value, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Transform and group data hierarchically
  const buildTree = (parentId = null) => {
    return enterpriseList
      .filter((ent) => (ent.parentEnterprise?._id || null) === parentId)
      .map((ent) => ({
        ...ent,
        children: buildTree(ent._id),
      }));
  };

  const enterpriseTree = buildTree();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node._id} className="ml-2">
        <label className="flex items-center gap-2 py-1 cursor-pointer">
          <input
            type="radio"
            name="enterprise-radio"
            value={node._id}
            checked={value === node._id}
            onChange={() => {
              onChange(node._id);
              setDropdownOpen(false);
            }}
          />
          <span
            className={`text-sm ${value === node._id ? "font-medium" : ""}`}
          >
            {"—".repeat(level)} {node.name}
          </span>
        </label>
        {node.children && node.children.length > 0 && (
          <div className="ml-4 border-l border-gray-300 pl-2">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-600 text-base font-semibold mb-1">
        Parent Enterprise (Optional)
      </label>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="w-full text-left border p-2 rounded text-sm border-gray-300 bg-white hover:bg-gray-50"
      >
        {value
          ? enterpriseList.find((ent) => ent._id === value)?.name
          : "-- No Parent (HEAD level) --"}
      </button>

      {dropdownOpen && (
        <div className="absolute z-10 bg-white border rounded mt-1 w-full max-h-60 overflow-y-auto shadow-md">
          <div className="p-2 space-y-1">
            <div className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="enterprise-radio"
                value=""
                checked={!value}
                onChange={() => {
                  onChange("");
                  setDropdownOpen(false);
                }}
              />
              <span className="text-sm">-- No Parent (HEAD level) --</span>
            </div>
            {renderTree(enterpriseTree)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseDropdownTree;
