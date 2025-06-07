import React, { useState, useEffect, useRef } from "react";

const getNestedEnterprises = (enterpriseList) => {
  const map = {};
  enterpriseList.forEach((ent) => {
    map[ent._id] = { ...ent, children: [] };
  });

  const roots = [];
  enterpriseList.forEach((ent) => {
    const parentId = ent.parentEnterprise?._id;
    if (parentId && map[parentId]) {
      map[parentId].children.push(map[ent._id]);
    } else {
      roots.push(map[ent._id]);
    }
  });

  return roots;
};

const findParentChain = (tree, targetId, path = []) => {
  for (let node of tree) {
    if (node._id === targetId) return [...path];
    if (node.children?.length) {
      const result = findParentChain(node.children, targetId, [
        ...path,
        node._id,
      ]);
      if (result) return result;
    }
  }
  return null;
};

const EnterpriseHierarchicalDropdown = ({
  allEnterprises = [],
  selectedValue,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState([]);
  const [filteredTree, setFilteredTree] = useState([]);
  const dropdownRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (selectedValue) {
      setSelectedId(selectedValue);
    }
  }, [selectedValue]);

  useEffect(() => {
    const tree = getNestedEnterprises(allEnterprises);
    setFilteredTree(tree);
  }, [allEnterprises]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearch(term);

    const fullTree = getNestedEnterprises(allEnterprises);

    if (!term.trim()) {
      // RESET TO DEFAULT STATE (show minimal expanded view)
      setFilteredTree(fullTree);

      // Optional: expand only parent chain of selected
      if (selectedId) {
        const chain = findParentChain(fullTree, selectedId);
        const newExpanded = chain ? [...chain] : [];
        if (!newExpanded.includes(selectedId)) newExpanded.push(selectedId);
        setExpandedIds(newExpanded);
      } else {
        setExpandedIds([]); // Or collapse completely
      }

      return;
    }

    // SEARCH FILTER LOGIC
    const matches = allEnterprises.filter((ent) =>
      ent.name.toLowerCase().includes(term)
    );
    const matchIds = new Set(matches.map((m) => m._id));

    const recursivelyFilter = (nodes) =>
      nodes
        .map((node) => {
          const filteredChildren = recursivelyFilter(node.children || []);
          if (matchIds.has(node._id) || filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean);

    const newTree = recursivelyFilter(fullTree);
    setFilteredTree(newTree);

    // Expand matching paths
    const expandedSet = new Set();
    matches.forEach((match) => {
      const chain = findParentChain(fullTree, match._id);
      if (chain) chain.forEach((id) => expandedSet.add(id));
      expandedSet.add(match._id);
    });
    setExpandedIds([...expandedSet]);
  };

  const renderEnterpriseTypeBadge = (type) => {
    const badgeColor =
      {
        HEAD: "bg-blue-100 text-blue-700",
        REGIONAL: "bg-purple-100 text-purple-700",
        BRANCH: "bg-green-100 text-green-700",
      }[type] || "bg-gray-100 text-gray-700";

    return (
      <span
        className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${badgeColor}`}
      >
        {type}
      </span>
    );
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedIds.includes(node._id);
    const hasChildren = node.children?.length > 0;

    return (
      <div key={node._id} className="ml-2">
        <div
          className={`flex items-center justify-between cursor-pointer p-1 rounded hover:bg-gray-100 ${
            selectedId === node._id ? "bg-green-100" : ""
          }`}
          onClick={() => {
            onChange(node._id);
            setSelectedId(node._id);
            setOpen(false);
          }}
        >
          <div className="flex items-center" style={{ marginLeft: level * 12 }}>
            {hasChildren && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node._id);
                }}
                className="text-gray-600 mr-1 text-sm select-none"
              >
                {isExpanded ? "▼" : "▶"}
              </span>
            )}
            <span className="text-sm text-gray-800">{node.name}</span>
            {renderEnterpriseTypeBadge(node.enterpriseType)}
          </div>
        </div>
        {isExpanded &&
          node.children.map((child) => renderNode(child, level + 1))}
      </div>
    );
  };

  const selectedEnterprise = allEnterprises.find(
    (e) => e._id === selectedValue
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-gray-600 text-base font-semibold mb-0.5">
        Create In Enterprise
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border p-1.5 text-sm rounded border-gray-300 bg-white text-left"
      >
        {selectedEnterprise
          ? `${selectedEnterprise.name}`
          : "Select Enterprise"}
        <span className="float-right text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-10 bg-white border w-full max-h-72 overflow-y-auto shadow-lg mt-1 rounded">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search enterprise..."
            className="w-full px-2 py-1 border-b text-sm"
          />
          <div className="p-1">
            {filteredTree.map((node) => renderNode(node))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseHierarchicalDropdown;
