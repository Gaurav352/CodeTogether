import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useDashboardStore = create((set, get) => ({
  rooms: [],
  fetchingRooms: false,
  hasFetchedRooms: false,

  fetchRooms: async () => {
    try {
      set({ fetchingRooms: true });
      const res = await axiosInstance.get("/room/getAllRooms");
      set({ rooms: res.data.rooms });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch workspaces");
    } finally {
      set({ fetchingRooms: false , hasFetchedRooms: true });
    }
  },

  createRoom: async (roomData) => {
    try {
      const res = await axiosInstance.post("/room/create", roomData);
      set((state) => ({
        rooms: [res.data.room, ...state.rooms],
      }));
      toast.success("Workspace initialized");
      return res.data.room;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create workspace");
      throw error;
    }
  }
}));

export default useDashboardStore;