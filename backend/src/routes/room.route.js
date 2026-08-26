import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { acceptInvite,createRoom, deleteRoom, getAllRooms, getJoinRequest, getRoomById, getWhiteboard, sendRoomInvites, leaveRoom, saveWhiteboard } from "../controllers/room.controller.js";

const router=express.Router();
router.use(protectRoute);
router.post("/create",createRoom);
router.post("/deleteRoom",deleteRoom);
router.get("/getAllRooms",getAllRooms);
router.get("/getRoomById/:roomId",getRoomById);
router.post("/leave",leaveRoom);
router.post("/sendInvites",sendRoomInvites);
router.post('/getJoinRequests/:roomId',getJoinRequest);
router.get("/getWhiteboard/:roomId", getWhiteboard);
router.post("/saveWhiteboard/:roomId", saveWhiteboard);
router.post("/acceptInvite", acceptInvite);

export default router;
