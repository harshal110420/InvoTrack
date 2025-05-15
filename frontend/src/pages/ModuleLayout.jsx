import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ModuleRoutes from "../routes/ModuleRoutes";
import useUnsavedChangesWarning from "../hooks/useUnsavedChangesWarning";
import { Home } from "lucide-react"; // At top

const ModuleLayout = () => {
  const { user } = useAuth();
  const { moduleName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDirty, setIsDirty] = useState(false);
  useUnsavedChangesWarning(isDirty); // Show browser warning on refresh/close if dirty

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const { modules } = useSelector((state) => state.permission);

  if (!user) return <Navigate to="/" />;

  const currentModule = modules.find(
    (module) => module.modulePath === moduleName
  );

  if (!currentModule) {
    return <div className="p-4 text-red-500">🚫 Unauthorized Access 1</div>;
  }

  const subModules = currentModule.menus || {};

  if (!subModules || Object.keys(subModules).length === 0) {
    return <div className="p-4 text-red-500">🚫 Unauthorized Access</div>;
  }

  // Sensitive routes like form pages
  const sensitiveRoutes = ["/create", "/edit", "/update"];
  const isSensitivePage = sensitiveRoutes.some((path) =>
    location.pathname.includes(path)
  );

  const handleHomeClick = () => {
    if (isSensitivePage && isDirty) {
      const confirmLeave = window.confirm(
        "Are you sure you want to leave this page? Unsaved changes will be lost."
      );
      if (!confirmLeave) return;
    }
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        moduleName={moduleName}
        subModules={subModules}
        collapsed={isSidebarCollapsed}
      />

      {/* Main Scrollable Area */}
      <div className="flex flex-col flex-grow overflow-y-auto">
        {/* Home Button */}
        <div className="sticky top-0 z-10 flex justify-start bg-white p-2 shadow-md">
          <button
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="text-gray-600 hover:text-gray-800 transition text-xl"
          >
            {isSidebarCollapsed ? "☰" : "☰"}{" "}
            {/* Can replace with lucide icons */}
          </button>
          <button
            onClick={handleHomeClick}
            title="Go to Home"
            className="text-blue-600 hover:text-blue-800 transition text-xl"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
        <ModuleRoutes />
        {/* Actual module content */}
        <Outlet context={{ setIsDirty }} />
      </div>
    </div>
  );
};

export default ModuleLayout;
