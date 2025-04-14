import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axiosInstance.get("/auth/me");
          // ✅ You can directly use fullName, email, role, etc.
          setUser(response.data);
          console.log(response);
        }
      } catch (err) {
        console.error("Session expired or invalid token");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user); // 👈 correct
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
