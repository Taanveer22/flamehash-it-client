import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL_LOCAL ||
    import.meta.env.VITE_API_URL_PRODUCTION,
  withCredentials: true,
});

export default axiosInstance;
