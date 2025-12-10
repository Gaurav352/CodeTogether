import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    otpValue:{
        type:Number,
        required:true
    },
    attempts:{
        type:Number,
        default:3
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true});   

const OTP = mongoose.model("OTP",otpSchema);
export default OTP;