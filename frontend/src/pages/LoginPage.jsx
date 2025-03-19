// src/pages/LoginPage.jsx
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full p-6 rounded-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
