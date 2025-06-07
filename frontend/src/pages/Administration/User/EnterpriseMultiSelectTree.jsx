import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// Utility: Convert flat list to nested tree
const getNestedEnterprises = (enterpriseList) => {
  const map = {};
  enterpriseList.forEach((ent) => (map[ent._id] = { ...ent, children: [] }));

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

// Utility: Check if node or any child matches search term
const nodeMatchesSearch = (node, term) => {
  if (node.name.toLowerCase().includes(term.toLowerCase())) return true;
  return node.children?.some((child) => nodeMatchesSearch(child, term));
};

const EnterpriseNode = ({
  enterprise,
  level,
  onToggle,
  selected,
  disabledIds,
  expandedIds,
  setExpandedIds,
  searchTerm,
}) => {
  const isExpanded = expandedIds.includes(enterprise._id);
  const hasChildren = enterprise.children?.length > 0;
  const isDisabled = disabledIds.includes(enterprise._id);

  if (searchTerm && !nodeMatchesSearch(enterprise, searchTerm)) return null;

  return (
    <div style={{ paddingLeft: `${level * 16}px` }} className="p-0.5">
      <div className="flex items-center space-x-2 hover:bg-gray-100 rounded-md px-2 py-1 transition cursor-pointer select-none">
        {hasChildren ? (
          <button
            type="button"
            onClick={() =>
              setExpandedIds((prev) =>
                isExpanded
                  ? prev.filter((id) => id !== enterprise._id)
                  : [...prev, enterprise._id]
              )
            }
            className="focus:outline-none text-gray-600 hover:text-blue-600 transition flex items-center justify-center w-6 h-6"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown size={18} className="text-black" />
            ) : (
              <ChevronRight size={18} className="text-black" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}

        <input
          type="checkbox"
          checked={selected.includes(enterprise._id)}
          onChange={() => onToggle(enterprise._id)}
          disabled={isDisabled}
          className="accent-blue-600 h-4 w-4 border-gray-500 rounded"
        />
        <span className="text-sm text-gray-800 ml-1">
          <strong>{enterprise.name}</strong>{" "}
          <span className="text-xs text-gray-500 ml-1">
            ({enterprise.enterpriseType})
          </span>
        </span>
      </div>

      {isExpanded &&
        hasChildren &&
        enterprise.children.map((child) => (
          <EnterpriseNode
            key={child._id}
            enterprise={child}
            level={level + 1}
            onToggle={onToggle}
            selected={selected}
            disabledIds={disabledIds}
            expandedIds={expandedIds}
            setExpandedIds={setExpandedIds}
            searchTerm={searchTerm}
          />
        ))}
    </div>
  );
};

const EnterpriseMultiSelectTree = ({
  allEnterprises = [],
  selectedIds = [],
  onSelectionChange,
  createInEnterpriseId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const nestedTree = useMemo(
    () => getNestedEnterprises(allEnterprises),
    [allEnterprises]
  );

  const disabledIds = useMemo(
    () => [createInEnterpriseId],
    [createInEnterpriseId]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Expand parents of matching nodes when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setExpandedIds([]);
      return;
    }

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

    const expanded = new Set();
    allEnterprises
      .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach((match) => {
        const chain = findParentChain(nestedTree, match._id);
        if (chain) chain.forEach((id) => expanded.add(id));
        expanded.add(match._id);
      });

    setExpandedIds([...expanded]);
  }, [searchTerm, allEnterprises, nestedTree]);

  // Auto-add createInEnterpriseId to selected if not already
  useEffect(() => {
    if (!createInEnterpriseId) return;

    if (!selectedIds.includes(createInEnterpriseId)) {
      onSelectionChange([...selectedIds, createInEnterpriseId]);
    }
  }, [createInEnterpriseId, selectedIds, onSelectionChange]);

  const handleToggle = useCallback(
    (id) => {
      if (id === createInEnterpriseId) return;
      const updated = selectedIds.includes(id)
        ? selectedIds.filter((eid) => eid !== id)
        : [...selectedIds, id];
      onSelectionChange(updated);
    },
    [selectedIds, onSelectionChange, createInEnterpriseId]
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-gray-600 text-base font-semibold mb-0.5">
        Assigned Enterprises
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border p-1.5 text-sm rounded border-gray-300 bg-white text-left"
      >
        <div className="flex flex-wrap gap-1">
          {selectedIds.length > 0 ? (
            selectedIds
              .map((id) => allEnterprises.find((ent) => ent._id === id))
              .filter(Boolean)
              .map((ent) => (
                <span
                  key={ent._id}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                    ${
                      ent._id === createInEnterpriseId
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                >
                  {ent.name}
                </span>
              ))
          ) : (
            <span className="text-gray-400 text-sm">Select Enterprises</span>
          )}
        </div>
        <span className="float-right text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-10 bg-white border w-full max-h-72 overflow-y-auto shadow-lg mt-1 rounded">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enterprise..."
            className="w-full px-2 py-1 border-b text-sm"
          />
          <div className="p-1">
            {nestedTree.map((node) => (
              <EnterpriseNode
                key={node._id}
                enterprise={node}
                level={0}
                onToggle={handleToggle}
                selected={selectedIds}
                disabledIds={disabledIds}
                expandedIds={expandedIds}
                setExpandedIds={setExpandedIds}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterpriseMultiSelectTree;
