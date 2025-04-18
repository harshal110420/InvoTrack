import { Routes, Route } from "react-router-dom";
import RolesPage from "../pages/Administration/Roles/RolesPage";
import RoleForm from "../pages/Administration/Roles/RoleForm"; // 👈 Import the RoleForm component
import MenuPage from "../pages/Administration/Menus/MenuPage";
import MenuForm from "../pages/Administration/Menus/MenusForm";

// Import more pages as needed

const ModuleRoutes = () => {
  return (
    <Routes>
      <Route path="role_management" element={<RolesPage />} />
      <Route path="role_management/create" element={<RoleForm />} />
      <Route path="role_management/update/:roleId" element={<RoleForm />} />
      <Route path="menu_management" element={<MenuPage />} />
      <Route path="/menu_management/create" element={<MenuForm />} />
      <Route path="/menus/edit/:id" element={<MenuForm />} />

      {/* Add more module-specific routes here */}
    </Routes>
  );
};

export default ModuleRoutes;
