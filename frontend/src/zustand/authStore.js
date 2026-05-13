import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useAuthStore = create((set, get) => ({
    authUser: null,
    authLoading: false,
    checkingAuth: true,
    setAuthUser: (user) => {
        set({ authUser: user })
    },
    login: async (data) => {
        try {
            set({ authLoading: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });
            return {
                success: true,
                user: res.data.user,
            };
        } catch (error) {
            console.log("Error in auth store login ", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Something went wrong!",
            };
        } finally {
            set({ authLoading: false });
        }
    },
    register: async (data) => {
        try {
            set({ authLoading: true });
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.user });
            return {
                success: true,
                user: res.data.user,
            };
        } catch (error) {
            console.log("error in auth store register", error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Something went wrong!",
            };
        } finally {
            set({ authLoading: false });
        }
    },
    checkAuth: async () => {
        try {
            set({ checkingAuth: true });

            const res = await axiosInstance.post(
                "/auth/me"
            );

            set({
                authUser: res.data.user,
            });

        } catch (error) {
            set({
                authUser: null,
            });

        } finally {
            set({ checkingAuth: false });
        }
    },
    logout: async () => {
        try {
            set({ authLoading: true });
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
        } catch (error) {
            console.log("Error in auth store logout ", error);
        } finally {
            set({ authLoading: false });
        }
    }
}))
export default useAuthStore;