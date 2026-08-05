import { create } from "zustand";
import useSocketStore from "./useSocketStore";
import toast from "react-hot-toast";
import ACTIONS from "../../../socketEvents.js";
import axiosInstance from "../lib/axios";

const useWorkspaceStore = create((set, get) => ({
    roomId:null,
    activeUsers: [],
    isListening: false,
    currentRoom:null,
    setRoomId: (roomId) => set({ roomId: roomId }),
    fetchCurrentRoom:async ()=>{
        const roomId=get().roomId;
        if(!roomId)return false;
        try{
            const res=await axiosInstance.get(`/room/getRoomById/${roomId}`);
            if(res.data.success){
                set({currentRoom:res.data.room});
                return true;
            }
        } catch (error){
            console.log("Error in fetching current room ", error);
            toast.error(error.response?.data?.message || "Failed to fetch current room");
            return false;
        }
    },
    initWorkspaceListeners: (roomId) => {
        const { socket } = useSocketStore.getState();
        if (!socket || get().isListening) return;
        socket.on(ACTIONS.GET_ONLINE_USERS, (users) => {
            set({ activeUsers: users });
            console.log("Active users updated: ", users);
        });
        socket.on(ACTIONS.USER_JOINED, ({ fullName }) => {
            toast.success(`${fullName} joined the workspace!`, {
                style: {
                    background: '#15173D',
                    color: '#F1E9E9',
                    border: '1px solid #982598'
                }
            });
        });
        set({ isListening: true });
    },
    cleanupWorkspaceListeners: () => {
        const { socket } = useSocketStore.getState();
        if (socket) {
            socket.off("UPDATE_USER_LIST");
            socket.off("USER_JOINED");
        }
        set({ isListening: false, activeUsers: [] });
    }
}));
export default useWorkspaceStore;