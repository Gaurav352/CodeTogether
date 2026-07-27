import express from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "../../../socketEvents.js";

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

function getUsersInRoom(roomId, socketIdToIgnore = null) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    const roomSocketIds = Array.from(room);

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
    socket.on(ACTIONS.JOIN_ROOM, ({ roomId }) => {
        socket.join(roomId);
        console.log("joining");
        
        const users = getUsersInRoom(roomId);
        
        io.in(roomId).emit(ACTIONS.GET_ONLINE_USERS, users);
        socket.to(roomId).emit(ACTIONS.USER_JOINED, { fullName });
    });
    socket.on(ACTIONS.FILE_UPDATED, ({ fileId, content, roomId }) => {
        socket.to(roomId).emit(ACTIONS.RECEIVE_FILE_UPDATED, {fileId,content});
    });
    socket.on(ACTIONS.SEND_MESSAGE,({roomId,formData,tempId})=>{
        
    })

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