import { create } from "zustand";
import axiosInstance from "../utils/axios";

const useMessageStore=create((set,get)=>({
    messages:[],
    fetchMessages:async(roomId)=>{
        try {
            console.log("here",roomId);
            const res=await axiosInstance.post(`/message/allMessages/${roomId}`);
            console.log(res.data.messages[0].senderId);
            if(res.data.success){
                set({messages:res.data.messages});
                console.log(res.data.messages);
                return true;
            }
        } catch (error) {
            console.log("Error in fetching messages ",error);
            return false;
        }
    },
    sendMessage:async(data,roomId)=>{
        try {
            const res=await axiosInstance.post(`/message/send/${roomId}`,data);
            if(res.data.success){
                set((state) => ({
                    messages: [...state.messages, res.data.msg]
                }));
                return true;
            }
        } catch (error) {
            console.log("Error in fetching messages ",error);
            return false;
        }
    }
}));
export default useMessageStore;