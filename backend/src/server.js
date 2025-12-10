import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import roomRoutes from "./routes/room.route.js";



dotenv.config();
app.use("/api/auth",authRoutes);
app.use("/api/room",authRoutes);


const PORT=process.env.PORT || 7000;
const app=express();
app.listen(PORT,(req,res)=>{
    console.log("App running on PORT ", PORT);
})