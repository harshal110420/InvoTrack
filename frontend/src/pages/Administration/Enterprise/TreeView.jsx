import React, { useState } from "react";

const TreeNode = ({ node }) => {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {node.children?.length > 0 ? (open ? "▼" : "▶") : "•"} {node.name}
      </div>
      {open && node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child._id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ data }) => {
  if (!data) return <p>No tree data available</p>;
  return (
    <ul>
      <TreeNode node={data} />
    </ul>
  );
};

export default TreeView;
