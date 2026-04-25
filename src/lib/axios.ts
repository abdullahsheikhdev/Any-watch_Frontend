import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config) => {
    // Token add করুন
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error handling
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;