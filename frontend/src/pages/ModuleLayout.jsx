import { useParams, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ModuleRoutes from "../routes/ModuleRoutes";



const ModuleLayout = () => {
  const { user } = useAuth();
  const { moduleName } = useParams();
  console.log("Module Name from URL (Module Layout)",moduleName);
  const { modules } = useSelector((state) => state.permission); // Use Redux state
  console.log("Modules from Redux in ModuleLayout (Module Layout)",modules);

  if (!user) return <Navigate to="/" />;

  const role = user.role;

  // Find the module by matching the moduleName with the module's modulePath
  const currentModule = modules.find(
    (module) => module.modulePath === moduleName
  );

  // If module not found, return unauthorized access
  if (!currentModule) {
    return <div className="p-4 text-red-500">🚫 Unauthorized Access 1</div>;
  }

  // Now, check if the subModules (Master, Transaction, Report) exist
  const subModules = currentModule.menus || {};

  if (!subModules || Object.keys(subModules).length === 0) {
    return <div className="p-4 text-red-500">🚫 Unauthorized Access</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar moduleName={moduleName} subModules={subModules} />

      {/* Main Content */}
      <div className="flex-grow p-6">
        <ModuleRoutes />
      </div>
    </div>
  );
};

export default ModuleLayout;
