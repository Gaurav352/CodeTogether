import axios from "axios";

const BACKEND_URL=import.meta.env.MODE === 'development'?'http://localhost:5000/api':'';
const axiosInstance = axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json",
    },
})
export default axiosInstance;