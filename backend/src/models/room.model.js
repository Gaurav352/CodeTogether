import mongoose from "mongoose";

const roomSchema=new mongoose.Schema({
    roomCode:{
        type:String,
        unique:true,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    description:{
        type:String,
        default:''
    },
    folders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Folder"
    }],
    inviteLink:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});   

const Room = mongoose.model("Room",roomSchema);
export default Room;