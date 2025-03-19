import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, handleLogout, loading } = useAuth();
  // console.log(user);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  if (loading) return <div className="p-4 text-lg">Loading dashboard...</div>;

  if (!user) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.fullName}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleLogoutClick}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
