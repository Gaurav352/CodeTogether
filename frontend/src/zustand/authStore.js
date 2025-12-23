import { create } from "zustand"
import axiosInstance from "../utils/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
    loading: false,
    isCheckingAuth: true,
    authUser: null,
    register: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/auth/register", data);
            console.log(response.data);
            if (response.data.success === true) {
                const user = response.data.userObj;
                set({ authUser: user });
                toast.success(`Welcome to CodeSync ${user.fullName}`);
                return true;
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        } finally {
            set({ loading: false });
        }
    },
    login: async (data) => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/auth/login", data);
            if (response.data.success) {
                const user = response.data.user;
                set({ authUser: user });
                toast.success(`Welcome back ${user.fullName}`);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        } finally {
            set({ loading: false });
        }
    },
    logout: async () => {
        set({ loading: true });
        try {
            const response = await axiosInstance.post("/auth/logout");
            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    },
    checkAuth: async () => {
        try {
            const res = await axiosInstance.post("/auth/me");
            if (res.data.success) {
                set({ authUser: res.data.user });
                console.log(res.data.user);
            }
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
}));

export default useAuthStore;