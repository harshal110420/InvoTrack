import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Color scheme for enterprise types
const typeColors = {
  HEAD: "bg-red-100 text-red-800",
  REGIONAL: "bg-yellow-100 text-yellow-800",
  BRANCH: "bg-green-100 text-green-800",
  DEFAULT: "bg-gray-100 text-gray-700",
};

const TreeNode = ({ node, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const typeClass = typeColors[node.enterpriseType] || typeColors.DEFAULT;

  return (
    <li className="relative pl-4 border-l-2 border-gray-300 last:border-l-0">
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded-md px-2 py-1 group"
        onClick={() => hasChildren && setOpen(!open)}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <span className="text-gray-500">
          {hasChildren ? (open ? "▼" : "▶") : "•"}
        </span>

        <span className="text-sm font-semibold text-gray-800">{node.name}</span>

        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded ${typeClass}`}
        >
          {node.enterpriseType}
        </span>
      </div>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 border-l border-dashed border-gray-300"
          >
            {node.children.map((child) => (
              <TreeNode key={child._id} node={child} level={level + 1} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const TreeView = ({ data }) => {
  if (!data) return <p className="text-gray-500">No data available</p>;

  return (
    <div className="max-h-[600px] overflow-auto rounded-lg shadow border border-gray-200 p-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Enterprise Hierarchy Tree
      </h2>
      <ul className="space-y-1">
        <TreeNode node={data} />
      </ul>
    </div>
  );
};

export default TreeView;
