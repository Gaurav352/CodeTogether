import { Router } from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import { createFile, createFolder, getFileTree,fetchFileContent,saveCode,deleteFolder,deleteFile } from "../controllers/folder.controller.js";

const router=Router();
router.use(protectRoute);
router.get("/getFileTree/:roomId",getFileTree);
router.post("/create",createFolder);
router.post("/createFile",createFile);
router.post('/fetchFileContent/:fileId',fetchFileContent);
router.post('/save/:fileId',saveCode);
router.delete("/deleteFolder",deleteFolder);
router.delete("/deleteFile",deleteFile);
export default router;