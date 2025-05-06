import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonWrapper from "../../../components/ButtonWrapper";
import { useNavigate } from "react-router-dom";
import { fetchGroupedMenus } from "../../../features/menus/menuSlice"; // Adjust the import path as necessary
console.log("✅ MenuPage component file is being imported");

const MenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: groupedMenus = [],
    loading,
    error,
  } = useSelector((state) => state.menus); // ✅ fixed 'loading'
  // console.log("Group menus", groupedMenus);
  // console.log("MenuPage loading", loading);
  // console.log("MenuPage error", error);

  useEffect(() => {
    dispatch(fetchGroupedMenus());
  }, [dispatch]);

  return (
    <div className="p-1 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Manage Menus</h2>
        <ButtonWrapper
          module="Administration"
          subModule="Menu Management"
          permission="new"
        >
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            onClick={() =>
              navigate("/module/admin-module/menu_management/create")
            }
          >
            Create Menu
          </button>
        </ButtonWrapper>
      </div>

      {loading && <p className="text-gray-600">Loading menus...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && groupedMenus.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Menu Name</th>
                <th className="px-4 py-3 border-b text-center">Module</th>
                <th className="px-4 py-3 border-b text-center">Category</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupedMenus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 capitalize">{menu.name}</td>
                  <td className="px-4 py-2 text-center">{menu.module}</td>
                  <td className="px-4 py-2 text-center">{menu.category}</td>
                  <td className="px-4 py-2 text-center">
                    {/* Add your action buttons here */}
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
                        className="mr-2"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    </ButtonWrapper>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
