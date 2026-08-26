import crypto from "crypto";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Folder from "../models/folder.model.js";
import File from "../models/file.model.js";
import JoinRequest from "../models/joinRequest.model.js";
import Whiteboard from "../models/whiteboard.model.js";
import nodemailer from 'nodemailer';
import Invite from "../models/joinRequest.model.js";
import mongoose from "mongoose";

function generateInviteCodeSecure() {
    return crypto.randomInt(100000, 1_000_000).toString();
}

export const generateInviteLink = (roomCode) => {
    const baseURL = (process.env.CLIENT_BASE_URL || "http://localhost:5173").replace(/\/$/, "");
    return `${baseURL}/join/${roomCode}`;
};

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
            .populate("rooms", "name description createdAt roomCode inviteLink members owner")


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
    let session;
    try {
        const userId = req.user?._id;
        const { roomId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }
        if (!roomId) {
            return res.status(401).json({ success: false, message: "Room doesn't exist" });
        }


        session = await mongoose.startSession();
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
        if (room.owner.equals(userId)) {
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
            return res.status(400).json({
                message: "Room Id is required!"
            });
        }

        const room = await Room.findById(roomID)
            .populate('owner', 'fullName email profilePicture')
            .populate('members', 'fullName email profilePicture');

        if (!room) {
            return res.status(404).json({
                message: "Room not found!",
                success: false
            });
        }

        const userId = req.user._id.toString();
        const isMember = room.members.some(member => member._id.toString() === userId);
        const isOwner = room.owner._id.toString() === userId;

        if (!isMember && !isOwner) {
            return res.status(403).json({
                message: "Unauthorized! You are not a member of this workspace.",
                success: false
            });
        }
        const roomData = room.toObject();
        roomData.members = roomData.members.filter(
            (member) => member._id.toString() !== roomData.owner._id.toString()
        );

        return res.status(200).json({
            message: "Fetched room data successfully!",
            success: true,
            room: roomData
        });

    } catch (error) {
        console.error("Get Room by Id Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const sendRoomInvites = async (req, res) => {

    try {
        const { roomId, emails } = req.body;
        const inviterId = req.user._id;
        const room = await Room.findOne({ _id: roomId });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        const clientBaseURL = process.env.CLIENT_BASE_URL || 'http://localhost:5173';
        const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        for (const email of emails) {
            const existingUser = await User.findOne({email});
            let isAlreadyInRoom = false;
            if(existingUser){
                const userId = existingUser._id.toString();
                const ownerId = room.owner.toString();
                const isMember = room.members.some(memberId => memberId.toString() === userId);
                if ((userId === ownerId) || isMember) {
                    isAlreadyInRoom = true;
                }
            }
            const pendingInvite = await Invite.findOne({
                roomId: room._id,
                invitedEmail: email,
                expiresAt: { $gt: new Date() } 
            });
            if (isAlreadyInRoom || pendingInvite) {
                continue;
            }
            
            const rawToken = crypto.randomBytes(32).toString('hex');
            await Invite.create({
                token: rawToken,
                roomId: room._id,
                invitedEmail: email,
                invitedBy: inviterId,
                expiresAt
            })
            const joinUrl = `${clientBaseURL}/join?token=${rawToken}`;
            console.log(joinUrl);
            await transporter.sendMail({
                from: `"CodeSync" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `You're invited to collaborate on ${room.name}`,
                html: `
          <div style="font-family: sans-serif; padding: 24px; background: #0b0e14; color: #fff; border-radius: 12px;">
            <h2 style="color: #e491c9;">Workspace Invitation</h2>
            <p><strong>${req.user.fullName}</strong> invited you to <strong>${room.name}</strong>.</p>
            <p style="font-size: 13px; color: #888;">This invite is intended exclusively for <strong>${email}</strong> and expires in 48 hours.</p>
            <a href="${joinUrl}" style="display: inline-block; background: #982598; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">Accept Invitation</a>
          </div>
        `,
            });
        }
        return res.status(200).json({ success: true, message: 'Invites sent securely.' });
    } catch (error) {
        return res.status(500).json({success:false, message: error.message });
    }

}
export const acceptInvite=async(req,res)=>{
    let session=null;
    try{
        const {token} = req.body;
        const userId=req.user._id;
        const userEmail = req.user.email;
        if(!token){
            return res.status(400).json({success:false,message:"You are not authorized to join this workspace"});
        }
        const invite=await Invite.findOne({token});
        if(!invite){
            return res.status(404).json({success:false,message:"Invalid or expired invite link"});
        }
        if (invite.expiresAt && new Date() > new Date(invite.expiresAt)) {
            await Invite.findByIdAndDelete(invite._id);
            return res.status(410).json({ success: false, message: "This invite link has expired" });
        }
        if (invite.invitedEmail && invite.invitedEmail.toLowerCase() !== userEmail.toLowerCase()) {
            return res.status(403).json({ 
                success: false, 
                message: `This invite was not sent to you.` 
            });
        }
        const roomId=invite.roomId;
        session = await mongoose.startSession();
        session.startTransaction();
        await Room.findByIdAndUpdate(roomId,{$addToSet:{members:userId}}).session(session);
        await User.findByIdAndUpdate(userId,{$addToSet:{rooms:roomId}}).session(session);
        await Invite.findByIdAndDelete(invite._id).session(session);
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({success:true,message:"Successfully joined the workspace",roomId});

    } catch(error){ 
        if (session) {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
            session.endSession(); 
        }
        console.error("Error in accepting invite: ", error);
        return res.status(500).json({success:false, message: error.message });
    }
}
export const getJoinRequest = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        if (!roomId) {
            return res.status(400).json({
                message: "Room not found",
                success: false
            });
        }
        const joinRequests = await JoinRequest.find({ roomId: roomId })
            .populate("senderId", "fullName email");

        return res.status(200).json({
            message: "Fetched all join requests",
            success: true
        });

    } catch (error) {
        console.log("error in fetching requests", error);
        return res.status(400).json({
            message: "Internal server error",
            success: false
        });
    }
}
export const getWhiteboard = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        if (!roomId) return res.status(401).json({
            message: "Invalid Room ID",
            success: false
        })
        const room = await Room.findById(roomId);
        if (!roomId) return res.status(404).json({
            message: "Room not found",
            success: false
        })
        let whiteboard = await Whiteboard.findOne({ roomId });
        if (!whiteboard) {
            whiteboard = await Whiteboard.create({ roomId, elements: [] });
        }
        res.status(200).json({
            message: "Whiteboard fetched",
            success: true,
            whiteboard
        })
    } catch (error) {
        console.log("Error in getting whiteboard ", error);
        res.status(500).json({ message: "Failed to fetch whiteboard", error });
    }
}
export const saveWhiteboard = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { elements, appState } = req.body;
        if (!roomId) return res.status(401).json({
            message: "Invalid Room ID",
            success: false
        })
        const room = await Room.findById(roomId);
        if (!roomId) return res.status(404).json({
            message: "Room not found",
            success: false
        })
        const whiteboard = await Whiteboard.findOneAndUpdate(
            { roomId },
            { elements, appState },
            { new: true, upsert: true }
        );
        res.status(200).json({ message: "Saved your progress", success: true, whiteboard });
    } catch (error) {
        console.log("Error in saving whiteboard ", error);
        res.status(500).json({ message: "Failed to save whiteboard", error });
    }
}