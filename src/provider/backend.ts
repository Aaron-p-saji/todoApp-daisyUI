import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Your Django backend API base URL
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration or other errors
    return Promise.reject(error);
  }
);

export default instance;
