import axios from "axios";

const baseURL = import.meta.env.mode === "development" ? "http://localhost:5000/api" :"/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default axiosInstance;