import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaChevronDown,
  FaChevronUp,
  FaSitemap,
  FaMapMarkerAlt,
  FaStore,
} from "react-icons/fa";
import EnterpriseCard from "./EnterpriseCard";
import { useSelector } from "react-redux";

const iconMap = {
  HEAD: <FaSitemap className="text-blue-600" />,
  REGIONAL: <FaMapMarkerAlt className="text-yellow-600" />,
  BRANCH: <FaStore className="text-green-600" />,
};

const EnterpriseSwitcherPanel = () => {
  const { user, selectedEnterprise, updateEnterprise } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [autoExpandIds, setAutoExpandIds] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const allEnterprises = useSelector(
    (state) => state.enterprise.enterpriseList
  );
  const dropdownRef = useRef();
  const flatList = useRef([]);

  // 🔄 Choose which enterprise list to use
  const enterpriseListToUse = user?.isSuperUser
    ? allEnterprises
    : user?.enterprises;

  // ⛔ Guard rendering if no enterprise data available
  if (!user || !enterpriseListToUse?.length) {
    console.warn("🚫 No enterprises available to show");
    return null;
  }

  // 🧠 Find selected enterprise (from correct source)
  const currentEnt = enterpriseListToUse.find(
    (ent) => ent._id === selectedEnterprise
  );

  // 🌳 Convert flat list to tree
  const buildTree = (enterprises) => {
    const map = {};
    const roots = [];
    enterprises.forEach((e) => {
      map[e._id] = { ...e, children: [] };
    });
    enterprises.forEach((e) => {
      const parentId =
        typeof e.parentEnterprise === "object"
          ? e.parentEnterprise?._id
          : e.parentEnterprise;
      if (parentId && map[parentId]) {
        map[parentId].children.push(map[e._id]);
      } else {
        roots.push(map[e._id]);
      }
    });
    return roots;
  };

  // 📌 Expand ancestor path
  const getAncestorPath = (enterprises, selectedId) => {
    const idToParentMap = {};
    enterprises.forEach((e) => {
      const parentId =
        typeof e.parentEnterprise === "object"
          ? e.parentEnterprise?._id
          : e.parentEnterprise;
      idToParentMap[e._id] = parentId;
    });

    const path = new Set();
    let currentId = selectedId;
    while (idToParentMap[currentId]) {
      path.add(idToParentMap[currentId]);
      currentId = idToParentMap[currentId];
    }
    return path;
  };

  // 🔍 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🖱️ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isExpanded) return;
      const flatItems = flatList.current;
      if (!flatItems.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatItems[highlightedIndex];
        if (selected) {
          updateEnterprise(selected.id);
          setIsExpanded(false);
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, highlightedIndex]);

  // 🪄 Expand relevant tree paths
  useEffect(() => {
    if (isExpanded && selectedEnterprise && enterpriseListToUse?.length) {
      const path = getAncestorPath(enterpriseListToUse, selectedEnterprise);
      setAutoExpandIds(path);
    }
  }, [isExpanded, selectedEnterprise, enterpriseListToUse]);

  const enterpriseTree = buildTree(enterpriseListToUse);
  flatList.current = [];

  return (
    <div className="relative w-fit ml-auto" ref={dropdownRef}>
      <div className="border bg-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2 min-w-[280px] justify-between">
        <div className="flex items-center gap-2 text-sm">
          {iconMap[currentEnt?.enterpriseType] || <FaStore />}
          <span className="font-medium text-gray-700 truncate max-w-[160px]">
            {currentEnt?.name} ({currentEnt?.enterpriseType})
          </span>
        </div>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-blue-500 text-sm hover:underline flex items-center"
        >
          {isExpanded ? (
            <>
              <FaChevronUp className="mr-1" /> Hide
            </>
          ) : (
            <>
              <FaChevronDown className="mr-1" /> Switch
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="absolute top-full right-0 z-20 mt-2 w-[350px] max-h-[420px] overflow-auto bg-white p-4 rounded-lg shadow-2xl border">
          <h2 className="text-md font-semibold mb-3 text-blue-600">
            All Enterprises
          </h2>
          <input
            type="text"
            placeholder="Search enterprises..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(0);
            }}
            className="w-full mb-3 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {enterpriseTree.map((ent) => (
            <EnterpriseCard
              key={ent._id}
              enterprise={ent}
              onSelect={(id) => {
                updateEnterprise(id);
                const selected = enterpriseListToUse.find((e) => e._id === id);
                setToastMessage(
                  `Switched to ${selected.name} (${selected.enterpriseType})`
                );
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);

                setIsExpanded(false);
                setSearchTerm("");
              }}
              selectedId={selectedEnterprise}
              searchTerm={debouncedTerm}
              highlightedIndex={highlightedIndex}
              setHighlightedIndex={setHighlightedIndex}
              flatList={flatList.current}
              indexTracker={{ current: 0 }}
              autoExpandIds={autoExpandIds}
            />
          ))}
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EnterpriseSwitcherPanel;
