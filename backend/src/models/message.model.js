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
        required:true
    },
    file:{
        type:String,
        default:''
    }
},{timestamps:true})
const Message=mongoose.model("message",messageSchema);
export default Message;