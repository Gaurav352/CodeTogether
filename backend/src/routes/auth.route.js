import express from "express";

const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/me",authMiddleware,getMe);
router.post("/logout",authMiddleware,logout);
router.post("/googleLogin",googleLogin);
router.post("/verify-email",authMiddleware,verify-email);
router.post("/send-otp",authMiddleware,sentOtp);
export default router;

