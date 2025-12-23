import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import roomRoutes from "./routes/room.route.js";
import { connectDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import folderRoutes from "./routes/folder.route.js";
import messageRoutes from "./routes/message.route.js";
import {server,app} from "./socket/socket.js";

dotenv.config();
const PORT=process.env.PORT || 7000;
app.use(cors({
    origin:'http://localhost:5173',
    methods:["PUT","PATCH","POST","DELETE","GET"],
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/room",roomRoutes);
app.use("/api/folder",folderRoutes);
app.use("/api/message",messageRoutes);


server.listen(PORT,(req,res)=>{
    console.log("App running on PORT ", PORT);
})
connectDB();