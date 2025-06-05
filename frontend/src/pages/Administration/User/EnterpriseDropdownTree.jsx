import React, { useState, useMemo, useRef, useEffect } from "react";

const buildEnterpriseTree = (enterprises) => {
  const map = {};
  const roots = [];

  enterprises.forEach((ent) => {
    map[ent._id] = { ...ent, children: [], isExpanded: false };
  });

  enterprises.forEach((ent) => {
    if (ent.parentEnterprise?._id) {
      map[ent.parentEnterprise._id]?.children.push(map[ent._id]);
    } else {
      roots.push(map[ent._id]);
    }
  });

  return roots;
};

const EnterpriseDropdownTree = ({ enterprises, selected, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({}); // Track expanded state by _id

  const dropdownRef = useRef(null); // Ref for dropdown container

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle expand/collapse for a node
  const toggleExpand = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter tree nodes by search - recursive, show node if it or any child matches
  const filterTree = (nodes, query) => {
    if (!query) return nodes;

    return nodes
      .map((node) => {
        const matchedChildren = filterTree(node.children || [], query);
        const isMatch = node.name.toLowerCase().includes(query.toLowerCase());
        if (isMatch || matchedChildren.length > 0) {
          return {
            ...node,
            children: matchedChildren,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const renderTree = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes[node._id] || false;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node._id}>
          <div
            className={`flex items-center cursor-pointer py-1 px-2 rounded hover:bg-blue-50 ${
              selected === node._id ? "bg-blue-100 font-semibold" : ""
            }`}
            style={{ paddingLeft: `${depth * 20}px` }}
          >
            {/* Expand/collapse toggle */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting on toggle click
                  toggleExpand(node._id);
                }}
                className="w-5 h-5 mr-1 flex items-center justify-center text-blue-600 hover:text-blue-800 select-none"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "−" : "+"}
              </button>
            ) : (
              <div style={{ width: "20px", marginRight: "4px" }}></div> // empty space for alignment
            )}

            {/* Enterprise Type Label */}
            <span className="mr-2 text-gray-600 text-xs font-medium uppercase tracking-wide w-16">
              {getEnterpriseLabel(node.enterpriseType)}
            </span>

            {/* Enterprise Name */}
            <span
              onClick={() => {
                onChange(node._id);
                setIsOpen(false);
              }}
              className="flex-1 truncate"
              title={node.name}
            >
              {node.name}
            </span>
          </div>

          {/* Render children if expanded */}
          {hasChildren && isExpanded && renderTree(node.children, depth + 1)}
        </div>
      );
    });
  };

  const getEnterpriseLabel = (type) => {
    switch (type) {
      case "HEAD":
        return "HEAD";
      case "REGIONAL":
        return "REGIONAL";
      case "BRANCH":
        return "BRANCH";
      default:
        return "OTHER";
    }
  };

  const enterpriseTree = useMemo(
    () => buildEnterpriseTree(enterprises),
    [enterprises]
  );
  const filteredTree = filterTree(enterpriseTree, search);

  return (
    <div
      ref={dropdownRef}
      className="relative w-[280px] text-sm font-sans"
      style={{ zIndex: 9999 }}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-gray-300 px-3 py-1.5 rounded-md bg-white shadow-sm cursor-pointer select-none text-sm font-medium text-gray-500"
      >
        {selected
          ? enterprises.find((e) => e._id === selected)?.name
          : "Select Enterprise"}
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded shadow-md max-h-64 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enterprises..."
            className="w-full px-3 py-2 border-b border-gray-300 text-sm outline-none"
            autoFocus
          />
          <div className="py-1">{renderTree(filteredTree)}</div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseDropdownTree;
