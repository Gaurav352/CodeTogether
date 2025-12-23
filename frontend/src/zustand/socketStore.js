import { create } from "zustand";
import { io } from "socket.io-client";
import ACTIONS from "../../../backend/src/socket/socketEvents.js"; 

const BACKEND_URL = 'http://localhost:5000'; 

const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,
    onlineUsers: [],
    connectAndJoin: (roomId, authUser) => {
        
        if (get().socket || get().isConnected && isConnected) return;
        const socket = io(BACKEND_URL, {
            query: { 
                userId: authUser._id, 
                fullName: authUser.fullName || authUser.fullname 
            },
            transports: ['websocket'] 
        });
        set({ socket: socket, isConnected: false });
        socket.on("connect", () => {
            console.log("CLIENT: Socket Connected:", socket.id);
            set({ isConnected: true });
            socket.emit(ACTIONS.JOIN_ROOM, { roomId, userId: authUser._id });
        });

        socket.on("disconnect", () => {
            console.log("CLIENT: Socket Disconnected");
            set({ isConnected: false }); 
        });

        socket.on(ACTIONS.GET_ONLINE_USERS, (users) => {
            set({ onlineUsers: users });
        });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
        }
        set({ socket: null, isConnected: false, onlineUsers: [] });
    }
}));

export default useSocketStore;