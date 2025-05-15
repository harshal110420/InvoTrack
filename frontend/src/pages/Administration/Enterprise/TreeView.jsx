import React, { useState } from "react";

const TreeNode = ({ node, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <li>
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
        onClick={() => hasChildren && setOpen(!open)}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {hasChildren ? (
          <span className="text-gray-500">{open ? "▼" : "▶"}</span>
        ) : (
          <span className="text-gray-400">•</span>
        )}
        <span className="text-sm font-medium text-gray-800">{node.name}</span>
        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          {node.enterpriseType}
        </span>
      </div>

      {open && hasChildren && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ data }) => {
  if (!data) return <p className="text-gray-500">No tree data available</p>;

  return (
    <div className="overflow-auto max-h-[500px]">
      <ul className="text-gray-700">
        <TreeNode node={data} />
      </ul>
    </div>
  );
};

export default TreeView;
