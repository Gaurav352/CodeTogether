import { Router } from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { sendMessage,getAllMessages } from "../controllers/message.controller.js";

const router=Router();
router.use(protectRoute);
router.post(`/send/:roomId`,sendMessage);
router.post('/allMessages/:roomId',getAllMessages);
export default router;