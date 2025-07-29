import axios from "axios";
import { BASE_URL } from "../constants.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if using cookies; not needed for token-based unless cross-origin
});

// ✅ Add interceptor to inject token in header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or from Redux/store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
