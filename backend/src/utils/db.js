import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB=async(req,res)=>{
    try {
        console.log(process.env.MONGO_URI);
        const resp=await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected!");
    } catch (error) {
        console.log("Error in db connection ",error);
    }
}