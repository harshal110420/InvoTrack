import React, { useState, useEffect, useRef } from "react";

const EnterpriseDropdownTree = ({
  enterpriseList = [],
  value,
  onChange,
  enterpriseType,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedHeads, setExpandedHeads] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Collapse all when enterprise type changes
  useEffect(() => {
    setExpandedHeads({});
  }, [enterpriseType]);

  // Collapse dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-expand on matching search term (only for BRANCH type)
  useEffect(() => {
    if (enterpriseType !== "BRANCH" || !searchTerm.trim()) {
      setExpandedHeads({});
      return;
    }

    const newExpanded = {};
    const regionals = enterpriseList.filter(
      (ent) =>
        ent.enterpriseType === "REGIONAL" &&
        ent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    regionals.forEach((reg) => {
      const headId = reg.parentEnterprise?._id;
      if (headId) newExpanded[headId] = true;
    });

    enterpriseList.forEach((ent) => {
      if (
        ent.enterpriseType === "HEAD" &&
        ent.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        newExpanded[ent._id] = true;
      }
    });

    setExpandedHeads(newExpanded);
  }, [searchTerm, enterpriseList, enterpriseType]);

  const renderEnterpriseTypeBadge = (type) => {
    const badgeColor = {
      HEAD: "bg-blue-100 text-blue-700",
      REGIONAL: "bg-purple-100 text-purple-700",
      BRANCH: "bg-green-100 text-green-700",
    }[type];

    return (
      <span
        className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${badgeColor}`}
      >
        {type}
      </span>
    );
  };

  const handleHeadToggle = (headId) => {
    setExpandedHeads((prev) => ({
      ...prev,
      [headId]: !prev[headId],
    }));
  };

  const renderTreeBasedOnType = () => {
    const filteredList = enterpriseList.filter((ent) =>
      ent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (enterpriseType === "REGIONAL") {
      return filteredList
        .filter((ent) => ent.enterpriseType === "HEAD")
        .map((ent) => (
          <div
            key={ent._id}
            className={`cursor-pointer px-2 py-1 hover:bg-gray-100 rounded ${
              value === ent._id ? "bg-green-100" : ""
            }`}
            onClick={() => {
              onChange(ent._id);
              setDropdownOpen(false);
              setSearchTerm("");
            }}
          >
            <span className="text-sm text-gray-700">{ent.name}</span>
            {renderEnterpriseTypeBadge(ent.enterpriseType)}
          </div>
        ));
    }

    if (enterpriseType === "BRANCH") {
      const heads = enterpriseList.filter(
        (ent) => ent.enterpriseType === "HEAD"
      );
      const regionals = enterpriseList.filter(
        (ent) => ent.enterpriseType === "REGIONAL"
      );

      return heads.map((head) => {
        const isExpanded = expandedHeads[head._id];
        const filteredChildren = regionals.filter(
          (reg) =>
            reg.parentEnterprise?._id === head._id &&
            reg.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const showHead =
          head.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filteredChildren.length > 0;

        if (!showHead) return null;

        return (
          <div key={head._id} className="mb-1">
            <div
              className="flex justify-between items-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => handleHeadToggle(head._id)}
            >
              <span className="text-sm text-gray-700 font-medium">
                {head.name}
              </span>
              <span className="text-gray-500">{isExpanded ? "▲" : "▼"}</span>
            </div>
            {isExpanded && (
              <div className="ml-4 border-l pl-2 border-gray-300">
                {filteredChildren.length ? (
                  filteredChildren.map((reg) => (
                    <div
                      key={reg._id}
                      className={`cursor-pointer px-2 py-1 hover:bg-gray-100 rounded ${
                        value === reg._id ? "bg-green-100" : ""
                      }`}
                      onClick={() => {
                        onChange(reg._id);
                        setDropdownOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className="text-sm text-gray-700">{reg.name}</span>
                      {renderEnterpriseTypeBadge(reg.enterpriseType)}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 px-2 py-1">
                    No matching regional enterprises
                  </div>
                )}
              </div>
            )}
          </div>
        );
      });
    }

    return (
      <div className="text-gray-500 text-sm px-2 py-2">
        Select an enterprise type to continue.
      </div>
    );
  };

  const selectedName = enterpriseList.find((ent) => ent._id === value)?.name;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Parent Enterprise
      </label>
      <button
        type="button"
        className="w-full border p-1.5 text-sm rounded border-gray-300 bg-white text-left"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        {selectedName || "Select Parent Enterprise"}
        <span className="float-right text-gray-500">
          {dropdownOpen ? "▲" : "▼"}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-72 overflow-y-auto shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search enterprises..."
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="p-1">{renderTreeBasedOnType()}</div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseDropdownTree;
