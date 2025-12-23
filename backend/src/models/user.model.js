import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,   
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    otp:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OTP",
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    },
    rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        default:[]
    }]
},{timestamps:true});   

const User = mongoose.model("User",userSchema);
export default User;