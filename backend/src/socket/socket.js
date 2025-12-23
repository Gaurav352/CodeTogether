import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);
import ACTIONS from "./socketEvents.js";

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Your Frontend URL
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});
const getUsersInRoom = (roomId) => {
    const roomSockets = io.sockets.adapter.rooms.get(roomId);
    if (!roomSockets) return [];

    const users = [];
    roomSockets.forEach((socketId) => {
        const userId = socketToUserMap[socketId];
        if (userId) users.push(userId);
    });
    return Array.from(new Set(users));
};
export const socketToUserMap = {};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const fullName = socket.handshake.query.fullName;
    if (userId && userId !== "undefined") {
        socketToUserMap[socket.id] = {userId,fullName};
        console.log(`User connected: ${userId}, Socket: ${socket.id}`);
    }
    socket.on(ACTIONS.JOIN_ROOM, ({ roomId, userId }) => {
        console.log("here IN JOIN ROOM");
        socket.join(roomId);
        socket.to(roomId).emit(ACTIONS.USER_JOINED, { userId });
        const usersInRoom = getUsersInRoom(roomId);
        console.log("users in room ",usersInRoom);
        io.to(roomId).emit(ACTIONS.GET_ONLINE_USERS, usersInRoom);
    })
    socket.on("disconnecting", () => {
        // 1. Find who is leaving
        console.log("disconnecting ", socket.id);
        const userId = socketToUserMap[socket.id];

        if (userId) {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                // Ignore the default room (which is same as socket.id)
                if (roomId !== socket.id) {
                    const remainingUsers = getUsersInRoom(roomId).filter(id => id !== userId);
                    io.to(roomId).emit(ACTIONS.GET_ONLINE_USERS, remainingUsers);
                }
            });
        }
    })

})
export { app, io, server };