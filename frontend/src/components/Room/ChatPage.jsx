import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  MoreVertical,
  X,
  File,
  Image as ImageIcon,
  Download
} from "lucide-react";
import useAuthStore from "../../zustand/authStore";
import useMessageStore from "../../zustand/messageStore";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import GlobalLoader from "../GlobalLoader";

const ChatPage = () => {
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { fetchMessages, sendMessage, messages } = useMessageStore();
  const [loading, setLoading] = useState(false);
  const { roomId } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAllMessages = async () => {
      setLoading(true);
      const res = await fetchMessages(roomId);
      if (!res) {
        toast.error("Failed to fetch messages");
      }
      setLoading(false);
    }
    fetchAllMessages();
  }, [roomId])


  const { authUser } = useAuthStore();

  // 1. Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages,loading]);

  // 2. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFilePreview({
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file), // Local preview URL
        originalFile: file
      });
    }
  };

  // 3. Handle Send
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!message || message.length === 0) && !filePreview) {
      toast("Message cannot be empty", {
        duration: 1500
      });
      return;
    }
    const data = {
      message
    }
    console.log(message);
    const res = await sendMessage(data, roomId);
    if (!res) {
      toast.error("Failed to send!");
    } else {
      setMessage('');
      setFilePreview(null);
    }

  };

  if (loading) return <GlobalLoader />
  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 relative overflow-hidden border-l border-slate-700/50">

      {/* --- HEADER --- */}
      <div className="h-14 border-b border-slate-700/50 flex items-center justify-between px-4 bg-[#1e293b]/50 backdrop-blur-sm shrink-0">
        <div>
          <h3 className="font-semibold text-white text-sm">Room Chat</h3>
          <p className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 1 Online
          </p>
        </div>
        <button className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-[#0F172A] to-[#0b1120]">
        {messages?.map((msg) => {
          const isMe = msg.senderId._id === (authUser?._id || "me");

          return (
            <div key={msg._id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg border border-white/10
                 ${isMe ? "bg-blue-600" : "bg-slate-600"}`}>
                {msg.senderId.profilePic ? (
                  <img src={msg.senderId.profilePic} alt="av" className="w-full h-full rounded-full object-cover" />
                ) : (
                  msg.senderId.name?.toUpperCase()
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-medium text-slate-400">{isMe ? "You" : msg.senderId.name}</span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words relative group ${isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-[#1e293b] text-slate-200 border border-slate-700/50 rounded-tl-none"
                  }`}>

                  {/* Text */}
                  {msg.text && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}

                  {/* Attachment (If exists) */}
                  {msg.file && (
                    <div className={`mt-2 flex items-center gap-3 p-2 rounded-lg border backdrop-blur-sm ${isMe ? "bg-white/10 border-white/20" : "bg-black/20 border-white/5"
                      }`}>
                      <div className="p-2 bg-white/10 rounded-md">
                        {msg.file.type === 'zip' ? <File size={18} /> : <ImageIcon size={18} />}
                      </div>
                      <div className="flex-1 overflow-hidden min-w-0">
                        <p className="truncate text-xs font-medium">{msg.file.name}</p>
                        <p className="text-[10px] opacity-70">1.2 MB</p>
                      </div>
                      <button className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
                        <Download size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-3 bg-[#1e293b]/30 border-t border-slate-700/50 shrink-0">

        {/* File Preview Banner (Shows when file is selected) */}
        {filePreview && (
          <div className="flex items-center justify-between bg-slate-800/80 p-2 px-3 rounded-lg mb-2 border border-blue-500/30 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-blue-400 p-1 bg-blue-500/10 rounded">
                {filePreview.type === 'image' ? <ImageIcon size={14} /> : <File size={14} />}
              </span>
              <span className="text-xs text-blue-200 truncate max-w-[180px]">{filePreview.name}</span>
            </div>
            <button onClick={() => setFilePreview(null)} className="text-slate-400 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          {/* File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 mb-0.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all active:scale-95"
            title="Attach file"
          >
            <Paperclip size={20} />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </button>

          {/* Text Input */}
          <div className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent text-slate-200 text-sm px-4 py-3 focus:outline-none resize-none custom-scrollbar max-h-32 placeholder:text-slate-600"
              style={{ minHeight: "44px" }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() && !filePreview}
            className="p-3 mb-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"
          >
            <Send size={18} strokeWidth={2.5} className={message.trim() ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;