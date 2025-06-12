import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance";
import { getFallbackEnterpriseId } from "../utils/authHelpers";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [selectedEnterprise, setSelectedEnterprise] = useState(
    sessionStorage.getItem("selectedEnterprise")
  );
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("selectedEnterprise");
    setToken(null);
    setUser(null);
    setSelectedEnterprise(null);
  }, []);

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      console.log("Token expiry time:", new Date(exp).toLocaleString());

      if (Date.now() > exp) {
        console.warn("Token expired. Logging out...");
        handleLogout();
      } else {
        const timeoutId = setTimeout(() => {
          console.warn("Token auto-expired. Logging out...");
          handleLogout();
        }, exp - Date.now());

        return () => clearTimeout(timeoutId);
      }
    } catch (err) {
      console.error("Invalid token:", err);
      handleLogout();
    }
  }, [token, handleLogout]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const response = await axiosInstance.get("/auth/me");
          const userData = response.data;
          setUser(userData);

          if (
            !sessionStorage.getItem("selectedEnterprise") &&
            !userData.isSuperUser
          ) {
            const fallback = getFallbackEnterpriseId(userData);
            if (fallback) {
              setSelectedEnterprise(fallback);
              sessionStorage.setItem("selectedEnterprise", fallback);
            }
          }

          if (userData.isSuperUser) {
            setSelectedEnterprise(null);
            sessionStorage.removeItem("selectedEnterprise");
          }
        }
      } catch (err) {
        console.error("Token invalid or expired:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogin = (data) => {
    const { token: jwt, user: userInfo } = data;

    sessionStorage.setItem("token", jwt);
    setToken(jwt);
    setUser(userInfo);

    if (userInfo.isSuperUser) {
      setSelectedEnterprise(null);
      sessionStorage.removeItem("selectedEnterprise");
    } else {
      const selected = getFallbackEnterpriseId(userInfo);
      setSelectedEnterprise(selected);
      sessionStorage.setItem("selectedEnterprise", selected);
    }
  };

  const updateEnterprise = async (enterpriseId) => {
    try {
      await axiosInstance.put("/auth/update-enterprise", { enterpriseId });
      setSelectedEnterprise(enterpriseId);
      sessionStorage.setItem("selectedEnterprise", enterpriseId);
    } catch (err) {
      console.error("Enterprise switch failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedEnterprise,
        loading,
        isAuthenticated: !!user,
        handleLogin,
        handleLogout,
        updateEnterprise,
        setSelectedEnterprise,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
