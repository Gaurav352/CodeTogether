import express from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { googleLogin, login, logout, me, register, sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/me",protectRoute,me);
router.post("/logout",protectRoute,logout);
router.post("/googleLogin",googleLogin);
router.post("/sendOtp",protectRoute,sendOtp);
router.post("/verifyOtp",protectRoute,verifyOtp);

export default router;

