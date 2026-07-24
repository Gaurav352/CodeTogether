import File from "../models/file.model.js";
import Folder from "../models/folder.model.js";
import Room from "../models/room.model.js";
import mongoose from "mongoose";
import {io} from "../socket/socket.js";
import ACTIONS from "../../../socketEvents.js";

export const createFolder = async (req, res) => {
    try {
        const { name, parent, roomId } = req.body;

        if (!name || !roomId) {
            return res.status(401).json({
                message: "Please provide all fields!",
                success: false
            })
        }
        const folder = new Folder({
            name,
            owner: req.user._id,
            roomId,
            parent
        })
        await folder.save();
        if (parent !== null) {
            await Folder.updateOne({ _id: parent }, { $push: { subfolders: folder._id } });
        }
        await Room.updateOne({ _id: roomId }, { $push: { folders: folder._id } });
        io.to(roomId).emit(ACTIONS.RECEIVE_FOLDER_CREATED,{newNode:folder,parentId:parent});
        return res.status(200).json({
            message: "Folder created",
            success: true,
            folder
        })

    } catch (error) {
        console.log("Error in folder creation ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
const getAllDescendantFolderIds = async (folderId, session) => {
    let descendantIds = [];
    
    const children = await Folder.find({ parent: folderId }, '_id').session(session);

    for (const child of children) {
        descendantIds.push(child._id);
        
        const subDescendants = await getAllDescendantFolderIds(child._id, session);
        descendantIds = [...descendantIds, ...subDescendants];
    }
    
    return descendantIds;
};

export const deleteFolder = async (req, res) => {
    const { folderId, roomId } = req.body;

    if (!folderId) {
        return res.status(400).json({ message: "No folderId found", success: false });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const descendantIds = await getAllDescendantFolderIds(folderId, session);
        const allFoldersToDelete = [folderId, ...descendantIds];

        await File.deleteMany(
            { folder: { $in: allFoldersToDelete } }, 
            { session }
        );

        await Room.updateOne(
            { _id: roomId }, 
            { $pullAll: { folders: allFoldersToDelete } }, 
            { session }
        );

        await Folder.deleteMany(
            { _id: { $in: allFoldersToDelete } }, 
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        io.to(roomId).emit(ACTIONS.RECEIVE_NODE_DELETED, { nodeId: folderId });

        return res.status(200).json({
            message: "Folder and all nested contents deleted successfully",
            success: true
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error("Error in recursive folder deletion:", error);
        return res.status(500).json({ 
            message: "Internal server error during deletion", 
            success: false 
        });
    }
};
export const deleteFile = async(req,res)=>{
    try{
        const {fileId,roomId} = req.body;
        if(!fileId){
            return res.status(400).json({
                message:"No fileid found",
                success:false
            })
        }
        await File.deleteOne({_id:fileId});
        io.to(roomId).emit(ACTIONS.RECEIVE_NODE_DELETED, { nodeId: fileId });
        return res.status(200).json({
            message:"File deleted",
            success:true
        })
    } catch(error){
        console.log("Error in file deletion ", error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}
export const getFileTree = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) return res.status(400).json({ message: "Room not found", success: false });
        const folders = await Folder.find({ roomId }).lean();
        const files = await File.find({ room: roomId }).lean();
        return res.json({ folders, files, message: "Fetched data successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const createFile = async (req, res) => {
    try {
        const { name, folder, roomId, language } = req.body;
        if (!name || !roomId) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }
        const file = await File.create({
            name,
            language,
            folder,
            room: roomId
        })
        io.to(roomId).emit(ACTIONS.RECEIVE_FILE_CREATED,{newNode:file,parentId:folder});
        return res.status(201).json({ message: "File created", success: true, file });
    } catch (error) {
        console.log("Error in file creation controller ", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
export const fetchFileContent = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        if (!fileId) return res.status(404).json({
            message: "file id not found",
            success: false
        })

        const file = await File.findById(fileId);
        console.log(file);
        return res.status(200).json({
            success: true,
            file
        })
    } catch (error) {
        console.log("error in file fetching controller ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}
export const saveCode = async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const { content } = req.body;
        if (!fileId) return res.status(404).json({
            message: "File is missing",
            success: false,
        })
        const file = await File.findByIdAndUpdate({ _id: fileId }, { content: content }, { new: true });
        return res.status(200).json({
            file,
            success: true
        })
    } catch (error) {
        console.log("error in saving file ", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}