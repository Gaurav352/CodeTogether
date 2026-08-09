import express from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "../../../socketEvents.js";
import { registerYjsHandlers, sweepIdleDocs } from "../yjs/collab.js";

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
const roomUserIds = {};

function getUsersInRoom(roomId, socketIdToIgnore = null) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return [];

    const roomSocketIds = Array.from(room);

    const activeSocketIds = socketIdToIgnore
        ? roomSocketIds.filter(id => id !== socketIdToIgnore)
        : roomSocketIds;

    const users = activeSocketIds
        .map(socketId => userSocketMap[socketId])
        .filter(user => user !== undefined);

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
    registerYjsHandlers(io, socket);

    if (userId && fullName && userId !== "undefined") {
        userSocketMap[socket.id] = { userId, fullName };
        console.log(`User connected: ${fullName} (${userId}), Socket: ${socket.id}`);
    }

    // 2. Handle Join Room
    socket.on(ACTIONS.JOIN_ROOM, ({ roomId }) => {
        socket.join(roomId);
        console.log("joining");

        if (!roomUserIds[roomId]) {
            roomUserIds[roomId] = new Set();
        }

        const isNewMember = !roomUserIds[roomId].has(userId);
        roomUserIds[roomId].add(userId);

        const users = getUsersInRoom(roomId);
        io.in(roomId).emit(ACTIONS.GET_ONLINE_USERS, users);

        if (isNewMember) {
            socket.to(roomId).emit(ACTIONS.USER_JOINED, { fullName });
        }
    });

    socket.on(ACTIONS.LEAVE_ROOM, ({ roomId }) => {
        if (!roomId) return;

        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);

        const remainingUsers = getUsersInRoom(roomId, socket.id);
        const stillPresent = remainingUsers.some(u => u.userId === userId);

        if (!stillPresent && roomUserIds[roomId]) {
            roomUserIds[roomId].delete(userId);
            if (roomUserIds[roomId].size === 0) {
                delete roomUserIds[roomId];
            }
        }
        io.in(roomId).emit(ACTIONS.GET_ONLINE_USERS, remainingUsers);
        socket.to(roomId).emit(ACTIONS.USER_LEFT, { fullName });
    });

    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            if (roomId !== socket.id) {
                const remainingUsers = getUsersInRoom(roomId, socket.id);
                socket.in(roomId).emit("UPDATE_USER_LIST", remainingUsers);

                const stillPresent = remainingUsers.some(u => u.userId === userId);
                if (!stillPresent && roomUserIds[roomId]) {
                    setTimeout(() => {
                        const usersNow = getUsersInRoom(roomId); // re-check current state
                        const backAgain = usersNow.some(u => u.userId === userId);
                        if (!backAgain && roomUserIds[roomId]) {
                            roomUserIds[roomId].delete(userId);
                            if (roomUserIds[roomId].size === 0) delete roomUserIds[roomId];
                        }
                    }, 5000);
                }
            }
        });

        delete userSocketMap[socket.id];
    });

});
setInterval(() => {
    sweepIdleDocs(io);
}, 60_000);

export { app, io, server };