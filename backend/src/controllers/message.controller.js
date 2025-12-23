import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/Message.model.js";


export const sendMessage=async(req,res)=>{
    try {
        const roomId=req.params.roomId;
        const {message,file}=req.body;
        if((!message || message.length===0) && !file)return res.status(400).json({
            success:false,
            message:"Message cannot be empty",
        })
        const room=await Room.findById(roomId);
        if(!room || !roomId){
            return res.status(404).json({
                success:false
            })
        }
        const newMessage=await Message.create({
            roomId,
            senderId:req.user._id,
            text:message || '',
            file:file || '',
        })
        const msg = await newMessage.populate("senderId", "fullName");
        
        return res.status(201).json({
            success:true,
            msg
        })

    } catch (error) {
        console.log("Error in message controller ",error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
        
    }
}
export const getAllMessages=async(req,res)=>{
    try {
        const roomId=req.params.roomId;
        const room=await Room.findById(roomId);
        if(!room || !roomId){
            return res.status(404).json({
                message:"Room not found",
                success:false
            })
        }
        const messages=await Message.find({roomId:roomId})
        .populate("senderId","fullName")
        .sort({createdAt:1});
        return res.status(200).json({
            message:"Fetched all messages",
            success:true,
            messages
        })

    } catch (error) {
        console.log("Error in fetching all messages controller ",error);
        return res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}