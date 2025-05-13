const GroupedListView = ({ data }) => {
  const groups = {
    HEAD: [],
    REGIONAL: [],
    BRANCH: [],
  };

  data.forEach((ent) => {
    if (groups[ent.enterpriseType]) groups[ent.enterpriseType].push(ent);
  });

  return (
    <div>
      {Object.entries(groups).map(([type, list]) => (
        <div key={type}>
          <h3>{type} Enterprises</h3>
          <ul>
            {list.map((ent) => (
              <li key={ent._id}>
                {ent.enterpriseCode} - {ent.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default GroupedListView;
