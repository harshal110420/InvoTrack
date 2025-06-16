import { useEffect, useMemo, useState } from "react";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { Eye, Pencil } from "lucide-react";
import { getModulePathByMenu } from "../../../utils/navigation";

const FlatListView = ({ data }) => {
  const navigate = useNavigate();
  const modules = useSelector((state) => state.modules.list);
  const menus = useSelector((state) => state.menus.list);
  const modulePath = getModulePathByMenu("enterprise_management", modules, menus);
  // Immediate input values
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchOwner, setSearchOwner] = useState("");
  const [searchStatus, setSearchStatus] = useState("all");

  // Debounced values
  const [debouncedSearchCode, setDebouncedSearchCode] = useState("");
  const [debouncedSearchName, setDebouncedSearchName] = useState("");
  const [debouncedSearchType, setDebouncedSearchType] = useState("");
  const [debouncedSearchOwner, setDebouncedSearchOwner] = useState("");

  // Debounced setters
  const debouncedSetCode = useMemo(
    () => debounce(setDebouncedSearchCode, 300),
    []
  );
  const debouncedSetName = useMemo(
    () => debounce(setDebouncedSearchName, 300),
    []
  );
  const debouncedSetType = useMemo(
    () => debounce(setDebouncedSearchType, 300),
    []
  );
  const debouncedSetOwner = useMemo(
    () => debounce(setDebouncedSearchOwner, 300),
    []
  );

  // Sync immediate values with debounced ones
  useEffect(() => debouncedSetCode(searchCode), [searchCode]);
  useEffect(() => debouncedSetName(searchName), [searchName]);
  useEffect(() => debouncedSetType(searchType), [searchType]);
  useEffect(() => debouncedSetOwner(searchOwner), [searchOwner]);

  const filteredData = data.filter((ent) => {
    const matchCode = ent.enterpriseCode
      ?.toLowerCase()
      .includes(debouncedSearchCode.toLowerCase());
    const matchName = ent.name
      ?.toLowerCase()
      .includes(debouncedSearchName.toLowerCase());
    const matchType = ent.enterpriseType
      ?.toLowerCase()
      .includes(debouncedSearchType.toLowerCase());
    const matchOwner = ent.ownerName
      ?.toLowerCase()
      .includes(debouncedSearchOwner.toLowerCase());
    const matchStatus =
      searchStatus === "all"
        ? true
        : searchStatus === "active"
        ? ent.isActive === true
        : ent.isActive === false;

    return matchCode && matchName && matchType && matchOwner && matchStatus;
  });

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-[1000px] w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            <th className="px-3 py-1.5 text-left">Code</th>
            <th className="px-3 py-1.5 text-left">Name</th>
            <th className="px-3 py-1.5 text-left">Type</th>
            <th className="px-3 py-1.5 text-left">Owner</th>
            <th className="px-3 py-1.5 text-left">Status</th>
            <th className="px-3 py-1.5 text-center">Actions</th>
          </tr>
          <tr className="bg-white sticky top-0 z-10 shadow-sm text-sm">
            <th className="px-3 py-2">
              <input
                type="text"
                placeholder="Search code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
              />
            </th>
            <th className="px-3 py-2">
              <input
                type="text"
                placeholder="Search name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
              />
            </th>
            <th className="px-3 py-2">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
              >
                <option value="">All Types</option>
                <option value="HEAD">HEAD</option>
                <option value="REGIONAL">REGIONAL</option>
                <option value="BRANCH">BRANCH</option>
              </select>
            </th>

            <th className="px-3 py-2">
              <input
                type="text"
                placeholder="Search owner"
                value={searchOwner}
                onChange={(e) => setSearchOwner(e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
              />
            </th>
            <th className="px-3 py-2">
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-full px-2 py-1 border text-xs border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </th>
            <th />
          </tr>
        </thead>
        <tbody className="text-gray-800 text-sm">
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="text-center py-6 text-gray-500 font-medium"
              >
                No enterprises found.
              </td>
            </tr>
          ) : (
            filteredData.map((ent, index) => (
              <tr
                key={ent._id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-2 whitespace-nowrap font-normal">
                  {ent.enterpriseCode}
                </td>
                <td className="px-3 py-2 whitespace-nowrap font-normal">
                  {ent.name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {ent.enterpriseType}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {ent.ownerName || "-"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
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
                <td className="px-3 py-2 whitespace-nowrap text-center flex justify-center gap-3">
                  <ButtonWrapper
                    subModule="Enterprise Management"
                    permission="edit"
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/module/${modulePath}/enterprise_management/update/${ent._id}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Enterprise"
                    >
                      <Pencil className="w-4 h-4 inline" />
                    </button>
                  </ButtonWrapper>

                  <ButtonWrapper
                    subModule="Enterprise Management"
                    permission="view"
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/module/${modulePath}/enterprise_management/get/${ent._id}`
                        )
                      }
                      className="text-green-600 hover:text-green-800"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 inline" />
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
