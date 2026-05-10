import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        default:'',
    },
    attachments: [{
        url: { type: String, required: true },
        publicId: { type: String, required: true }, // For deletion
        fileType: { type: String, enum: ["image", "video", "raw","code"], default: "raw" },
        originalName: { type: String } // Useful for displaying "homework.pdf"
    }],
},{timestamps:true})
const Message=mongoose.model("message",messageSchema);
export default Message;