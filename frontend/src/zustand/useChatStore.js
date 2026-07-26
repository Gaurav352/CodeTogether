import {create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
const useChatStore = create((set,get)=>({
    messages:[],
    fetchMessages:async(roomId)=>{
        if(!roomId)return false;
        try{
            const res = await axiosInstance.get(`/message/allMessages/${roomid}`);
            if(res.data.success){
                set({messages:res.data.messages});
                return true;
            }
        } catch (error){
            console.log("Error in fetching messages ",error);
            toast.error(error.response?.data?.message || "Failed to fetch messages");
            return false;
        }
    },
    sendMessage:async(roomId,formData)=>{
        if(!roomId)return false;
        try{
            const res = await axiosInstance.post(`/message/send/${roomId}`,{formData});
            if(res.data.success){
                
            }
        } catch (error){

        }
    }
}));