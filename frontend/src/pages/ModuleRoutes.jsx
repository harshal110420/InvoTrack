import { Routes, Route } from "react-router-dom";
import RolesPage from "../pages/RolesPage";
// Import more pages as needed

const ModuleRoutes = () => {
  return (
    <Routes>
      <Route path="roles" element={<RolesPage />} />
      {/* Add more module-specific routes here */}
    </Routes>
  );
};

export default ModuleRoutes;
