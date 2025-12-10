import express from "express";

const router=express.Router();
router.use(authMiddleware);
router.post("/create",verifiedUserMiddleware,createRoom);
router.post("/invite",invite);
router.post("/deleteRoom",deleteRoom);
router.post("/getMyRooms",getAllRooms);
router.post("/getRoomBy/:roomId",getRoomById);

export default router;
