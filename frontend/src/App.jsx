import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import ModuleLayout from "./pages/ModuleLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage"; // ✅ Import Login Page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />{" "}
          {/* ✅ Add Login Route */}
          {/* 🔹 Dashboard Route */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* 🔹 Module Routes with Sidebar */}
          <Route
            path="/module/:moduleName/*"
            element={
              <PrivateRoute>
                <ModuleLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
