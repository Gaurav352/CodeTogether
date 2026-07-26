import { Router } from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { sendMessage,getAllMessages } from "../controllers/message.controller.js";
import upload from "../middlewares/multer.js";

const router=Router();
router.use(protectRoute);
router.post(`/send/:roomId`,upload.array("files", 5),sendMessage);
router.get('/allMessages/:roomId',getAllMessages);
export default router;