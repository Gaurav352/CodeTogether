import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { createRoom, deleteRoom, getAllRooms, getRoomById, invite, leaveRoom } from "../controllers/room.controller.js";

const router=express.Router();
router.use(protectRoute);
router.post("/create",createRoom);
router.post("/invite",invite);
router.post("/deleteRoom",deleteRoom);
router.post("/getAllRooms",getAllRooms);
router.post("/getRoomById/",getRoomById);
router.post("leave",leaveRoom);

export default router;
