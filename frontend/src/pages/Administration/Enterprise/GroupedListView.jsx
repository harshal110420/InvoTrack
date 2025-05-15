import React from "react";
import { Building2 } from "lucide-react"; // Optional: Icon library (shadcn/lucide)

const GroupedListView = ({ data }) => {
  const groups = {
    HEAD: [],
    REGIONAL: [],
    BRANCH: [],
  };

  data.forEach((ent) => {
    if (groups[ent.enterpriseType]) {
      groups[ent.enterpriseType].push(ent);
    }
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "HEAD":
        return "bg-blue-100 text-blue-800";
      case "REGIONAL":
        return "bg-yellow-100 text-yellow-800";
      case "BRANCH":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-12">
      {Object.entries(groups).map(([type, list]) => (
        <div key={type}>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="text-gray-700" />
            <h3 className="text-xl font-semibold text-gray-800">
              {type.charAt(0) + type.slice(1).toLowerCase()} Enterprises
            </h3>
          </div>

          {list.length === 0 ? (
            <p className="text-gray-500 italic">
              No enterprises found in this group.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((ent) => (
                <div
                  key={ent._id}
                  className="bg-white rounded-2xl shadow-md border p-5 transition hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getTypeColor(
                        ent.enterpriseType
                      )}`}
                    >
                      {ent.enterpriseType}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        ent.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {ent.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Code:</span>{" "}
                    {ent.enterpriseCode}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Name:</span> {ent.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Owner:</span>{" "}
                    {ent.ownerName || "-"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedListView;
