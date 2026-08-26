import { create } from "zustand";
import useSocketStore from "./useSocketStore";
import toast from "react-hot-toast";
import ACTIONS from "../../../socketEvents.js";
import axiosInstance from "../lib/axios";

const useWorkspaceStore = create((set, get) => ({
    roomId: null,
    activeUsers: [],
    isListening: false,
    currentRoom: null,
    setRoomId: (roomId) => set({ roomId: roomId }),
    fetchCurrentRoom: async () => {
        const roomId = get().roomId;
        if (!roomId) return false;
        try {
            const res = await axiosInstance.get(`/room/getRoomById/${roomId}`);
            if (res.data.success) {
                set({ currentRoom: res.data.room });
                console.log("Current room fetched: ", res.data.room);
                return true;
            }
        } catch (error) {
            console.log("Error in fetching current room ", error);
            toast.error(error.response?.data?.message || "Failed to fetch current room");
            return false;
        }
    },
    sendInvites:async(emails)=>{
        const roomId=get().roomId;
        if(!roomId)return ;
        try{
            const res = await axiosInstance.post(`/room/sendInvites`,{roomId,emails});
            if(res.data.success){
                toast.success("Invites sent successfully");
                return true;
            }
        } catch(error){
            console.log("Error in sending invites ", error);
            toast.error(error.response?.data?.message || "Failed to send invites");
            return false;
        }
    },
    acceptInvite:async(token)=>{
        try{
            const res=await axiosInstance.post(`/room/acceptInvite`,{token});
            if(res.data.success){
                toast.success("Successfully joined the room");
                return res.data.roomId;
            } 
        } catch(error){
            console.log("Error in accepting invite ", error);
            toast.error(error.response?.data?.message || "Failed to accept invite");
            return false;
        }
    },
    handleLeaveRoom:async()=>{
        if(!get().roomId)return;
        try{
            const res=await axiosInstance.post(`/room/leave`,{roomId:get().roomId});
            if(res.data.success){
                toast.success("Successfully left the room");
                set({roomId:null,currentRoom:null,activeUsers:[]});
                return true;
            }
        } catch(error){
            console.log("Error in leaving room ", error);
            toast.error(error.response?.data?.message || "Failed to leave room");
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
        socket.on(ACTIONS.USER_LEFT, ({ fullName }) => {
            toast(`${fullName} left the room`, { icon: '👋' });
        });
        set({ isListening: true });
    },
    cleanupWorkspaceListeners: () => {
        const { socket } = useSocketStore.getState();
        if (socket) {
            socket.off(ACTIONS.GET_ONLINE_USERS);
            socket.off(ACTIONS.USER_JOINED);
        }
        set({ isListening: false, activeUsers: [] });
    }
}));
export default useWorkspaceStore;