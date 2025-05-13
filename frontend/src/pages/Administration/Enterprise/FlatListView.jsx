import React from "react";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";

const FlatListView = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">Code</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Type</th>
            <th className="px-6 py-3 text-left">Owner</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="text-center py-6 text-gray-500 font-medium"
              >
                No enterprises found.
              </td>
            </tr>
          ) : (
            data.map((ent, index) => (
              <tr
                key={ent._id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {ent.enterpriseCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{ent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {ent.enterpriseType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ent.ownerName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      ent.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ent.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <ButtonWrapper
                    subModule="Enterprise management"
                    permission="edit"
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/module/admin-module/enterprise/update/${ent._id}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Enterprise"
                    >
                      ✏️
                    </button>
                  </ButtonWrapper>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FlatListView;
