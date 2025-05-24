import React, { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, ChevronRight, ChevronDown } from "lucide-react";

const EnterpriseDropdownTree = ({
  enterpriseList = [],
  value = [],
  onChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : [];

  const buildTree = (parentId = null) => {
    return enterpriseList
      .filter(
        (ent) =>
          (ent.parentEnterprise?._id || null) === parentId &&
          ent.name.toLowerCase().includes(search.toLowerCase())
      )
      .map((ent) => ({
        ...ent,
        children: buildTree(ent._id),
      }));
  };

  const enterpriseTree = buildTree();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxChange = (id) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((item) => item !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const getBadge = (type) => {
    switch (type) {
      case "HEAD":
        return (
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            HEAD
          </span>
        );
      case "REGIONAL":
        return (
          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
            REGIONAL
          </span>
        );
      case "BRANCH":
        return (
          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
            BRANCH
          </span>
        );
      default:
        return null;
    }
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      return (
        <div key={node._id} className="ml-2">
          <div className="flex items-center gap-2 py-1 cursor-pointer">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node._id)}
                className="text-sm"
              >
                {expanded[node._id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              <span className="w-4 inline-block" />
            )}
            <input
              type="checkbox"
              checked={selectedValues.includes(node._id)}
              onChange={() => handleCheckboxChange(node._id)}
            />
            <span className="text-sm font-medium">
              {"—".repeat(level)} {node.name} {getBadge(node.enterpriseType)}
            </span>
          </div>
          {hasChildren && expanded[node._id] && (
            <div className="ml-4 border-l border-gray-300 pl-2">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-600 text-base font-semibold mb-1">
        Parent Enterprises (Multi-Select)
      </label>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="w-full text-left border p-2 rounded text-sm border-gray-300 bg-white hover:bg-gray-50 flex justify-between items-center"
      >
        <span>
          {selectedValues.length > 0
            ? selectedValues
                .map((id) => enterpriseList.find((e) => e._id === id)?.name)
                .join(", ")
            : "-- Select Enterprises --"}
        </span>
        <ChevronsUpDown size={16} />
      </button>

      {dropdownOpen && (
        <div className="absolute z-10 bg-white border rounded mt-1 w-full max-h-64 overflow-y-auto shadow-md">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full mb-2 px-2 py-1 border rounded text-sm border-gray-300"
            />
            {renderTree(enterpriseTree)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseDropdownTree;
