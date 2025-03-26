import { useParams, Outlet, Navigate, Route ,Routes} from "react-router-dom";
import { rolePermissionsConfig } from "../config/rolePermissionsConfig";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import RolesPage from "./RolesPage";

const ModuleLayout = () => {
  const { user } = useAuth();
  const { moduleName } = useParams();

  if (!user) return <Navigate to="/" />;

  const role = user.role;
  const modules = rolePermissionsConfig[role]?.modules || {};
  const subModules = modules[moduleName.charAt(0).toUpperCase() + moduleName.slice(1)];

  if (!subModules) return <div className="p-4 text-red-500">🚫 Unauthorized Access</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar moduleName={moduleName} subModules={subModules} />

      {/* Main Content */}
      <div className="flex-grow p-6">
      <Routes>
          <Route path="roles" element={<RolesPage />} />  {/* ✅ Add Route for RolesPage */}
          <Route path="*" element={<Outlet />} /> {/* ✅ Catch All Nested Routes */}
        </Routes>
      </div>
    </div>
  );
};

export default ModuleLayout;
