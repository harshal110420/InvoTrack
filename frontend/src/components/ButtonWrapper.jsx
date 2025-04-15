import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

const ButtonWrapper = ({ module, subModule, permission, children }) => {
  const { user } = useAuth();
  const role = user?.role;
  const { modules } = useSelector((state) => state.permission);

  console.log("🧠 ButtonWrapper Debug:");
  console.log("User Role:", role);
  console.log("Modules:", modules);
  console.log("Checking:", { module, subModule, permission });

  const moduleObj = Array.isArray(modules)
    ? modules.find(
        (mod) => mod.moduleName === module || mod.modulePath === module
      )
    : null;

  if (!moduleObj) {
    console.log("❌ Module not found in permission state");
    return null;
  }

  let actions = [];

  const allMenus = moduleObj.menus;

  if (subModule) {
    // Search in all menu types (Master, Transaction, Report)
    for (let type of ["Master", "Transaction", "Report"]) {
      const menuList = allMenus[type] || [];
      const foundMenu = menuList.find(
        (menu) => menu.name === subModule || menu.menuId === subModule
      );
      if (foundMenu) {
        actions = foundMenu.actions || [];
        break;
      }
    }
  } else {
    // No subModule, check all actions in all menus
    actions = Object.values(allMenus)
      .flat()
      .flatMap((menu) => menu.actions || []);
  }

  const hasPermission = actions.includes(permission);

  console.log("Actions Found:", actions);
  console.log("Permission Allowed?", hasPermission);

  if (!hasPermission) return null;

  return <>{children}</>;
};

export default ButtonWrapper;
