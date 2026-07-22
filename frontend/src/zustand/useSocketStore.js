import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = "http://localhost:5000"; // Ensure this matches your Express port

const useSocketStore = create((set, get) => ({
  socket: null,
  
  connect: (userId, fullName) => {
    if (get().socket) return; // Prevent duplicate connections

    const newSocket = io(BACKEND_URL, {
      query: { 
        userId, 
        fullName 
      }
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));

export default useSocketStore;