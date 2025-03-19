import axiosInstance from "./axiosInstance";

// 👇 Login API - POST /auth/login
export const loginUser = async (loginData) => {
  return axiosInstance.post("/auth/login", loginData);
};

// 👇 Logout API - POST /auth/logout
export const logoutUser = async () => {
  return axiosInstance.post("/auth/logout");
};
