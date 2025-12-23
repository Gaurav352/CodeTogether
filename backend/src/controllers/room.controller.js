import crypto from "crypto";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import JoinRequest from "../models/joinRequest.model.js";

function generateInviteCodeSecure() {
    return crypto.randomInt(100000, 1_000_000).toString();
}

function generateInviteLink(roomCode) {
    const baseURL = process.env.CLIENT_BASE_URL || "http://localhost:5173";
    return `${baseURL}/room/${roomCode}`;
}

export const createRoom = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                message: "Provide all fields",
                success: false,
            });
        }
        let roomCode;
        const MAX_ATTEMPTS = 5;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const candidate = generateInviteCodeSecure();
            const exists = await Room.findOne({ roomCode: candidate }).select("_id").lean(); //lean for plain js object
            if (!exists) {
                roomCode = candidate;
                break;
            }
        }
        const inviteLink = generateInviteLink(roomCode);
        const room = await Room.create({
            roomCode,
            owner: req.user._id,
            description,
            name,
            members: [req.user._id],
            inviteLink,
        });
        await User.findByIdAndUpdate(req.user._id, {
            $push: { rooms: room._id }
        });

        return res.status(201).json({
            message: "Room successfully created!",
            success: true,
            room,
        });
    } catch (error) {
        console.error("Error in creating Room:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};
export const getAllRooms = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("here");
        if (!userId) {
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }
        
        const user = await User.findById(userId)
            .populate("rooms", "name description createdAt roomCode inviteLink")
        
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Rooms fetched successfully",
            success: true,
            rooms: user.rooms,
        });


    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

export const deleteRoom = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { roomId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        if (!roomId) {
            return res.status(401).json({ success: false, message: "Room doesn't exist" });
        }


        const session = await mongoose.startSession();
        session.startTransaction();
        const room = await Room.findById(roomId).session(session);
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        if (!room.owner.equals(userId)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ success: false, message: "Forbidden: not allowed to delete this room" });
        }
        await File.deleteMany({ room: roomId }).session(session);
        await Folder.deleteMany({ room: roomId }).session(session);
        await User.updateMany({ _id: { $in: room.members } }, { $pull: { rooms: roomId } }).session(session);
        await Room.deleteOne({ _id: roomId }).session(session);

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ success: true, message: "Room and its content deleted" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("deleteRoom error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const leaveRoom = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { roomId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        if (!roomId) {
            return res.status(401).json({ success: false, message: "Room doesn't exist" });
        }
        const room = await Room.findById(roomId);
        if (!room.owner.equals(userId)) {
            return res.status(405).json({
                message: "Creator cannot leave the room",
                success: false
            })
        }
        await Room.updateOne({ _id: roomId }, { $pull: { members: userId } });
        await User.updateOne({ _id: userId }, { $pull: { rooms: roomId } });
        return res.status(200).json({
            message: "Left room successfully!",
            success: true
        })
    } catch (error) {
        console.error("LeftRoom error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export const getRoomById = async (req, res) => {
    try {
        const roomID = req.params.roomId;
        if (!roomID) {
            return res.status(404).json({
                message: "Room Id not found!"
            })
        }
        const room = await Room.findById(roomID);
        if (!room.members.includes(req.user._id)) {
            return res.status(403).json({
                message: "Unauthorized to access!",
                success: false
            })
        }
        return res.status(200).json({
            message: "Fetched room data successfully!",
            success: true,
            room
        })
    } catch (error) {
        console.error("Getroom by Id error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const invite=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
export const sendJoinRequest=async(req,res)=>{
    try {
        const {roomCode,message}=req.body;
        if(!roomCode){
            return res.status(400).json({
                message:"RoomCode not found",
                success:false
            })
        }
        const room=await Room.findOne({roomCode:roomCode});
        if(!room){
            return res.status(404).json({
                message:"Room not exist",
                success:false
            })
        }
        if (room.members.includes(req.user._id)) {
            return res.status(400).json({
                message: "You are already a member of this room",
                success: false
            });
        }
        const existingRequest = await JoinRequest.findOne({ 
            senderId: req.user._id, 
            roomId: room._id 
        });
        if(existingRequest){
            return res.status(400).json({
                message:"Request already sent",
                success:false
            })
        }
        await JoinRequest.create({
            senderId: req.user._id,
            roomId: room._id,    
            message: message || '',
            status: "pending"
        });
        return res.status(201).json({
            success:true,message: "Request sent successfully"
        })
    } catch (error) {
        console.error("error in sending join request ", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const getJoinRequest=async(req,res)=>{
    try {
        const roomId=req.params.roomId;
        if(!roomId){
            return res.status(400).json({
                message: "Room not found",
                success: false
            });
        }
        const joinRequests = await JoinRequest.find({roomId:roomId})
        .populate("senderId","fullName email");

        return res.status(200).json({
            message: "Fetched all join requests",
            success: true
        });

    } catch (error) {
        console.log("error in fetching requests",error);
        return res.status(400).json({
            message: "Internal server error",
            success: false
        });
    }
}