import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { createRoom, deleteRoom, getAllRooms, getJoinRequest, getRoomById, getWhiteboard, invite, leaveRoom, saveWhiteboard, sendJoinRequest } from "../controllers/room.controller.js";

const router=express.Router();
router.use(protectRoute);
router.post("/create",createRoom);
router.post("/invite",invite);
router.post("/deleteRoom",deleteRoom);
router.get("/getAllRooms",getAllRooms);
router.post("/getRoomById/:roomId",getRoomById);
router.post("leave",leaveRoom);
router.post("/sendJoinRequest",sendJoinRequest);
router.post('/getJoinRequests/:roomId',getJoinRequest);
router.get("/getWhiteboard/:roomId", getWhiteboard);
router.post("/saveWhiteboard/:roomId", saveWhiteboard);

export default router;
