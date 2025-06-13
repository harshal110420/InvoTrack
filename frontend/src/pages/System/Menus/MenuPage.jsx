import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupedMenus } from "../../../features/menus/menuSlice";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { PlusCircle } from "lucide-react";

const MenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: menus = [],
    loading,
    error,
  } = useSelector((state) => state.menus);

  const [searchInput, setSearchInput] = useState("");
  const [searchName, setSearchName] = useState("");

  const [moduleFilter, setModuleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchGroupedMenus());
  }, [dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchName(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesName = menu.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesModule =
      moduleFilter === "all" || menu.module === moduleFilter;
    const matchesCategory =
      categoryFilter === "all" || menu.category === categoryFilter;
    return matchesName && matchesModule && matchesCategory;
  });

  const moduleOptions = [...new Set(menus.map((menu) => menu.module))];
  const categoryOptions = [...new Set(menus.map((menu) => menu.category))];

  return (
    <div className="max-w-full px-4 py-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Menus</h1>
        <ButtonWrapper subModule="Menu Management" permission="new">
          <button
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() =>
              navigate("/module/system-module/menu_management/create")
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>
        </ButtonWrapper>
      </div>

      {loading && <p className="text-gray-600">Loading menus...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-[1000px] w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-1.5 text-left">Menu Name</th>
                <th className="px-3 py-1.5 text-left">Module</th>
                <th className="px-3 py-1.5 text-left">Category</th>
                <th className="px-3 py-1.5 text-center">Actions</th>
              </tr>
              <tr className="bg-white sticky top-0 z-10 shadow-sm text-sm">
                <th className="px-3 py-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search Name"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  />
                </th>
                <th className="px-3 py-2">
                  <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  >
                    <option value="all">All Modules</option>
                    {moduleOptions.map((module) => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="px-3 py-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs"
                  >
                    <option value="all">All Categories</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm">
              {filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No menus found.
                  </td>
                </tr>
              ) : (
                filteredMenus.map((menu, index) => (
                  <tr
                    key={menu.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-3 py-2 capitalize">{menu.name}</td>
                    <td className="px-3 py-2">{menu.module}</td>
                    <td className="px-3 py-2">{menu.category}</td>
                    <td className="px-3 py-2 text-center flex justify-center gap-3">
                      <ButtonWrapper
                        subModule="Menu Management"
                        permission="edit"
                      >
                        <button
                          onClick={() =>
                            navigate(
                              `/module/system-module/menu_management/update/${menu.id}`
                            )
                          }
                          title="Edit Menu"
                          className="text-blue-600 hover:text-blue-800"
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
      )}
    </div>
  );
};

export default MenuPage;
