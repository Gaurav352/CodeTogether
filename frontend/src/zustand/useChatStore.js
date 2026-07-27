import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import useAuthStore from "./authStore";
import useSocketStore from "./useSocketStore";
import ACTIONS from "../../../socketEvents.js";

const useChatStore = create((set, get) => ({
    messages: [],
    fetchMessages: async (roomId) => {
        if (!roomId) return false;
        try {
            const res = await axiosInstance.get(`/message/allMessages/${roomId}`);
            if (res.data.success) {
                set({ messages: res.data.messages });
                return true;
            }
        } catch (error) {
            console.log("Error in fetching messages ", error);
            toast.error(error.response?.data?.message || "Failed to fetch messages");
            return false;
        }
    },
    sendMessage: async (roomId, formData) => {
        if (!roomId) return false;
        const authUser = useAuthStore.getState().authUser;
        const tempId = `temp-${nanoid()}`;
        const text = formData.get("text") || "";
        const files = formData.getAll("attachments");
        if (files.length > 5) {
            console.error("Maximum 5 files allowed per message.");
            toast.error("Max 5 files allowed");
            return false;
        }
        const localAttachments = files.map((file)=>({
            fileName:file.name,
            fileUrl:URL.createObjectURL(file),
            fileType:file.type
        }));
        const optimisticMessage = {
            _id:tempId,
            roomId,
            senderId:{
                _id:authUser._id,
                fullName:authUser.fullName
            },
            text,
            attachments:localAttachments,
            status:"sending",
            createdAt:new Date().toISOString()
        }
        set((state)=>({messages:[...state.messages,optimisticMessage]}));
        try {
            console.log(optimisticMessage);
            const res = await axiosInstance.post(`/message/send/${roomId}`,formData,{
                headers:{'Content-Type':"multipart/form-data"}
            });
            if (res.data.success) {
                set((state)=>({
                    messages:state.messages.map((msg)=>{
                        if(msg._id === tempId){
                            msg.attachments?.forEach((att)=>{
                                if(att.fileUrl){
                                    URL.revokeObjectURL(att.fileUrl);
                                }
                            });
                            return {
                                ...msg ,
                                senderId:res.data.msg.senderId,
                                attachments:res.data.msg.attachments,
                                status:"sent",
                                createdAt:res.data.msg.createdAt
                            }
                        }
                        return msg;
                    })
                }))
                return true;
            }

        } catch (error) {
            console.log("Error in sending message ", error);
            set((state)=>({
                messages:state.messages.map((msg)=>{
                    return msg._id === tempId ? {...msg,status:"failed"}:msg;
                })
            }))
            toast.error(error.response?.data?.message || "Failed to send message");
            return false;
        }
    },
    initChatListeners:()=>{
        const authUser = useAuthStore.getState().authUser;
        const socket = useSocketStore.getState().socket;
        if(!socket || !authUser)return;
        socket.off(ACTIONS.RECEIVE_MESSAGE);
        socket.on(ACTIONS.RECERIVE_MESSAGE,({msg})=>{
            if(msg.senderId._id === authUser._id){
                return ;
            }
            set((state) => {
                const isDuplicate = state.messages.some((m) => m._id === msg._id);
                if (isDuplicate) return state;
                return {
                    messages: [...state.messages, msg]
                };
            });
        })
    },
    cleanupChatListeners:()=>{
        const socket = useSocketStore.getState().socket;
        if(socket){
            socket.off(ACTIONS.RECEIVE_MESSAGE);
        }
    }
}));
export default useChatStore;