import React from "react";

const HierarchyNode = ({ node, level = 0 }) => {
  return (
    <div className={`pl-${level * 4} py-1`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800">
          📁 {node.name}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {node.enterpriseType}
        </span>
      </div>
      {node.children.length > 0 && (
        <div className="ml-4 border-l border-gray-300 pl-4 mt-1">
          {node.children.map((child) => (
            <HierarchyNode key={child._id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyView = ({ data }) => {
  const map = {};
  const roots = [];

  data.forEach((ent) => {
    map[ent._id] = { ...ent, children: [] };
  });

  data.forEach((ent) => {
    const parentId = ent.parentEnterprise?._id || ent.parentEnterprise;
    if (parentId && map[parentId]) {
      map[parentId].children.push(map[ent._id]);
    } else {
      roots.push(map[ent._id]);
    }
  });

  return (
    <div className="overflow-auto h-full">
      {roots.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No hierarchy found.</p>
      ) : (
        roots.map((node) => <HierarchyNode key={node._id} node={node} />)
      )}
    </div>
  );
};

export default HierarchyView;
