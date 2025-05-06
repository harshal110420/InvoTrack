import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify styles
import Dashboard from "./pages/DashboardPage";
import ModuleLayout from "./pages/ModuleLayout";
import PrivateRoute from "./components/privateRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage"; // ✅ Import Login Page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/module/:moduleName/*"
            element={
              <PrivateRoute>
                <ModuleLayout />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* ToastContainer is placed here to display notifications globally */}
        <ToastContainer position="top-right" autoClose={800} />
      </Router>
    </AuthProvider>
  );
}

export default App;
