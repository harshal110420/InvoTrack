import { Routes, Route } from "react-router-dom";
import RolesPage from "../pages/Administration/Roles/RolesPage";
import RoleForm from "../pages/Administration/Roles/RoleForm"; // 👈 Import the RoleForm component
import MenuPage from "../pages/System/Menus/MenuPage";
import MenuForm from "../pages/System/Menus/MenusForm";
import PermissionsPage from "../pages/System/Permission/PermissionPage";
import EnterprisePage from "../pages/Administration/Enterprise/EnterprisePage";
import EnterpriseDetailPage from "../pages/Administration/Enterprise/EnterpriseDetailPage";
import EnterpriseForm from "../pages/Administration/Enterprise/EnterpriseForm";

// Import more pages as needed

const ModuleRoutes = () => {
  return (
    <Routes>
      <Route path="role_management" element={<RolesPage />} />
      <Route path="role_management/create" element={<RoleForm />} />
      <Route path="role_management/update/:roleId" element={<RoleForm />} />

      <Route path="menu_management" element={<MenuPage />} />
      <Route path="menu_management/create" element={<MenuForm />} />
      <Route path="menu_management/update/:id" element={<MenuForm />} />

      <Route path="permission_management" element={<PermissionsPage />} />

      <Route path="enterprise_management" element={<EnterprisePage />} />
      <Route path="/enterprise_management/create" element={<EnterpriseForm />} />
      <Route path="/enterprise_management/update/:id" element={<EnterpriseForm />} />
      <Route
        path="enterprise_management/get/:id"
        element={<EnterpriseDetailPage />}
      />
      {/* Add more module-specific routes here */}
    </Routes>
  );
};

export default ModuleRoutes;
