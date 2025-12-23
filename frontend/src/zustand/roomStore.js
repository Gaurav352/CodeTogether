import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import useSocketStore from "./socketStore";
const useRoomStore = create((set, get) => ({
    currentRoom: null,
    allRooms: [],
    roomLoading: false,
    joinRequests: [],
    createRoom: async (data) => {
        set({ roomLoading: true });
        try {
            const res = await axiosInstance.post("/room/create", data);
            if (res.data.success) {
                set({ currentRoom: res.data.room._id });
                return res.data.room._id;
            }
        } catch (error) {
            toast.error("Room creation failed!");
            return false;
        } finally {
            set({ roomLoading: false });
        }
    },
    fetchAllRooms: async () => {
        set({ roomLoading: true });
        try {

            const res = await axiosInstance.post("/room/getAllRooms");
            if (res.data.success) {
                set({ allRooms: res.data.rooms });
                return true;
            }
        } catch (error) {
            toast.error("Failed to fetch rooms");
            return false;
        } finally {
            set({ roomLoading: false });
        }
    },
    fetchCurrentRoom: async (roomId, authUser) => {

        try {
            const res = await axiosInstance.post(`/room/getRoomById/${roomId}`);
            if (res.data.success) {

                set({ currentRoom: res.data.room });
                const { connectAndJoin } = useSocketStore.getState();
                if (authUser) {
                    console.log("Room fetched successfully. Initializing Socket...");
                    connectAndJoin(roomId, authUser);
                }
                return true;
            }
        } catch (error) {
            toast.error("Workspace initialisation failed");
            return false;
        }
    },
    fetchPendingRequests: async (roomId) => {
        try {
            const res = await axiosInstance.post(`/room/getJoinRequests/${roomId}`);
            if (res.data.success) {
                set({ joinRequests: res.data.joinRequests });
                return true;
            }
        } catch (error) {
            console.log("ERROR in fetching requests", error);
            return false;
        }
    },
    sendJoinRequest: async (data) => {
        try {
            const res = await axiosInstance.post(`/room/getJoinRequests/${roomId}`, data);
            if (res.data.success) {
                set({ joinRequests: res.data.joinRequests });
                return true;
            }
        } catch (error) {
            console.log("ERROR in fetching requests", error);
            return false;
        }
    }
}));
export default useRoomStore;