import { create } from "zustand";
import useSocketStore from "./useSocketStore";
import toast from "react-hot-toast";
import ACTIONS from "../../../socketEvents.js";

const useWorkspaceStore = create((set, get) => ({
    roomId:null,
    activeUsers: [],
    isListening: false,
    setRoomId: (roomId) => set({ roomId: roomId }),
    initWorkspaceListeners: (roomId) => {
        const { socket } = useSocketStore.getState();
        if (!socket || get().isListening) return;
        socket.emit(ACTIONS.JOIN_ROOM, { roomId });
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