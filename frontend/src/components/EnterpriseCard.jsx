import {
  FaSitemap,
  FaMapMarkerAlt,
  FaStore,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";

// Icons for enterprise types
const iconMap = {
  HEAD: <FaSitemap className="text-blue-600" />,
  REGIONAL: <FaMapMarkerAlt className="text-yellow-600" />,
  BRANCH: <FaStore className="text-green-600" />,
};

// Recursive card component
const EnterpriseCard = ({
  enterprise,
  level = 0,
  onSelect,
  selectedId,
  searchTerm,
  highlightedIndex,
  setHighlightedIndex,
  flatList,
  indexTracker,
  autoExpandIds,
}) => {
  const [expanded, setExpanded] = useState(
    level === 2 || autoExpandIds?.has(enterprise._id)
  );

  const hasChildren = enterprise.children?.length > 0;

  const isMatch = enterprise.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const hasMatchingDescendant = (enterprise, term) => {
    const lowerTerm = term.toLowerCase();
    if (enterprise.name.toLowerCase().includes(lowerTerm)) return true;
    if (!enterprise.children) return false;

    return enterprise.children.some((child) =>
      hasMatchingDescendant(child, term)
    );
  };

  const shouldRender =
    searchTerm === "" || hasMatchingDescendant(enterprise, searchTerm);

  useEffect(() => {
    if (autoExpandIds?.has(enterprise._id)) {
      setExpanded(true);
    }
  }, [autoExpandIds]);

  useEffect(() => {
    if (searchTerm && isMatch) {
      setExpanded(true);
    }
  }, [searchTerm]);

  if (!shouldRender) return null;

  const currentIndex = indexTracker.current++;
  flatList.push({ id: enterprise._id });

  return (
    <div className="mb-1">
      <div
        className={`cursor-pointer border p-2 rounded-md shadow-sm flex items-center justify-between transition-all ${
          selectedId === enterprise._id ? "bg-blue-100" : "bg-white"
        } ${highlightedIndex === currentIndex ? "ring-2 ring-blue-400" : ""}`}
        style={{ marginLeft: `${level * 16}px` }}
        onMouseEnter={() => setHighlightedIndex(currentIndex)}
        onClick={() => onSelect(enterprise._id)}
      >
        <div className="flex items-center gap-2 w-full">
          {iconMap[enterprise.enterpriseType] || <FaStore />}
          <span className="text-sm font-normal truncate">
            {enterprise.name} ({enterprise.enterpriseType})
          </span>
        </div>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {expanded &&
        hasChildren &&
        enterprise.children.map((child) => (
          <EnterpriseCard
            key={child._id}
            enterprise={child}
            level={level + 1}
            onSelect={onSelect}
            selectedId={selectedId}
            searchTerm={searchTerm}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
            flatList={flatList}
            indexTracker={indexTracker}
            autoExpandIds={autoExpandIds}
          />
        ))}
    </div>
  );
};

export default EnterpriseCard;
