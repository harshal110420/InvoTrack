const HierarchyView = ({ data }) => {
  const map = {};
  const roots = [];

  data.forEach((ent) => {
    map[ent._id] = { ...ent, children: [] };
  });

  data.forEach((ent) => {
    if (ent.parentEnterprise) {
      map[ent.parentEnterprise]?.children.push(map[ent._id]);
    } else {
      roots.push(map[ent._id]);
    }
  });

  return (
    <ul>
      {roots.map((parent) => (
        <li key={parent._id}>
          <strong>{parent.name}</strong>
          {parent.children.length > 0 && (
            <ul>
              {parent.children.map((child) => (
                <li key={child._id}>{child.name}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
export default HierarchyView;
