import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Your Frontend URL
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});

// Store socketId -> { userId, fullName }
const userSocketMap = {};

// HELPER: Get all unique users in a room
// "socketIdToIgnore" is used during disconnection to calculate the list 
// AS IF that socket has already left.
function getUsersInRoom(roomId, socketIdToIgnore = null) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    // 1. Get all socket IDs currently in the room
    const roomSocketIds = Array.from(room);

    // 2. Filter out the socket that is currently disconnecting (if any)
    const activeSocketIds = socketIdToIgnore 
        ? roomSocketIds.filter(id => id !== socketIdToIgnore)
        : roomSocketIds;

    // 3. Map active sockets to User Data
    const users = activeSocketIds
        .map(socketId => userSocketMap[socketId])
        .filter(user => user !== undefined); // Remove undefined/nulls

    // 4. Deduplicate Users by userId
    // This ensures that if a user has 2 tabs open, they are only listed ONCE.
    const uniqueUsers = [];
    const processedUserIds = new Set();

    users.forEach(user => {
        if (!processedUserIds.has(user.userId)) {
            uniqueUsers.push(user);
            processedUserIds.add(user.userId);
        }
    });

    return uniqueUsers;
}

io.on("connection", (socket) => {
    // 1. Capture User Info from Query Params
    const userId = socket.handshake.query.userId;
    const fullName = socket.handshake.query.fullName;

    if (userId && fullName && userId !== "undefined") {
        userSocketMap[socket.id] = { userId, fullName };
        console.log(`User connected: ${fullName} (${userId}), Socket: ${socket.id}`);
    }

    // 2. Handle Join Room
    socket.on("JOIN_ROOM", ({ roomId }) => {
        socket.join(roomId);
        
        // Get fresh list of users in this room
        const users = getUsersInRoom(roomId);
        
        // Notify everyone (including the new joiner)
        io.in(roomId).emit("UPDATE_USER_LIST", users);
        
        // Optional: Notify others that X joined
        socket.to(roomId).emit("USER_JOINED", { fullName });
    });
    socket.on("CODE_CHANGE", ({ roomId, code }) => {
        console.log(code);
        socket.to(roomId).emit("CODE_CHANGE", {code});
    });

    // 3. Handle Disconnection (Tab Close / Refresh)
    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        
        rooms.forEach((roomId) => {
            // Check if this is a real room (socket.io creates a default room for the socket.id)
            if (roomId !== socket.id) {
                // Calculate what the room looks like WITHOUT this specific socket
                const remainingUsers = getUsersInRoom(roomId, socket.id);
                
                // Send the updated list to the remaining people in the room
                socket.in(roomId).emit("UPDATE_USER_LIST", remainingUsers);
            }
        });

        // Finally, remove from global map
        delete userSocketMap[socket.id];
    });
});

export { app, io, server };