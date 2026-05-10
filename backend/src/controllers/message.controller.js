import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/Message.model.js";
import { io } from "../socket/socket.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


export const sendMessage = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const { message } = req.body;
        const files = req.files;
        if(files?.length>5){
            return res.status(400).json({
                message:"Maximum files allowed is 5",
                success:false,
            })
        }
        console.log(req.files);

        if ((!message || message.trim().length === 0) && (!files || files.length === 0)) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }
        const room = await Room.findById(roomId);
        if (!room || !roomId) {
            return res.status(404).json({
                success: false
            })
        }
        let attachments = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map((file) => {
                return uploadToCloudinary(file.buffer,file.originalname);
            });
            const uploadResults = await Promise.all(uploadPromises);
            attachments = uploadResults.map((result, index) => {
                const originalFile = files[index];
                const name = originalFile.originalname.toLowerCase();
                const mime = originalFile.mimetype;

                // Determine type based on Multer's mimetype
                let type = "raw";
                if (mime.startsWith("image/")) {
                    type = "image";
                }
                else if (mime.startsWith("video/")) {
                    type = "video";
                }
                else if (
                    mime.startsWith("text/") ||
                    mime.includes("javascript") ||
                    mime.includes("json") ||
                    name.endsWith(".cpp") ||
                    name.endsWith(".py") ||
                    name.endsWith(".java") ||
                    name.endsWith(".js") ||
                    name.endsWith(".html") ||
                    name.endsWith(".css")
                ) {
                    type = "code";
                }
                return {
                    url: result.secure_url,
                    publicId: result.public_id,
                    fileType: type, 
                    originalName: originalFile.originalname
                };
            });
        }
        const newMessage = await Message.create({
            roomId,
            senderId: req.user._id,
            text: message || '',
            attachments: attachments
        })
        const msg = await newMessage.populate("senderId", "fullName");
        io.to(roomId).emit("RECEIVE_MESSAGE", msg);
        return res.status(201).json({
            success: true,
            msg
        })

    } catch (error) {
        console.log("Error in message controller ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })

    }
}
export const getAllMessages = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await Room.findById(roomId);
        if (!room || !roomId) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            })
        }
        const messages = await Message.find({ roomId: roomId })
            .populate("senderId", "fullName _id")
            .sort({ createdAt: 1 });
        return res.status(200).json({
            message: "Fetched all messages",
            success: true,
            messages
        })

    } catch (error) {
        console.log("Error in fetching all messages controller ", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}