import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Image as ImageIcon, Send, FileCode2, Zap, X, FileText, Check, Clock, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useAuthStore from '../../zustand/authStore';
import useChatStore from '../../zustand/useChatStore';
import useWorkspaceStore from '../../zustand/useWorkspaceStore';

export default function LiveChatPanel({activeTab}) {
    const { roomId } = useWorkspaceStore();

    const authUser = useAuthStore((state) => state.authUser || state.user) || useAuthStore();
    const { messages, fetchMessages, sendMessage, initChatListeners } = useChatStore();

    const [inputText, setInputText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    
    const [isAtBottom, setIsAtBottom] = useState(true);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (!roomId) return;
        fetchMessages(roomId);
        initChatListeners();
    }, [roomId]);

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setIsAtBottom(isNearBottom);
    };

    useEffect(() => {
        if (activeTab === 'chat') {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                setIsAtBottom(true);
            }, 10);
        }
    }, [activeTab]);

    // When new messages arrive -> Smooth scroll only if at bottom
    useEffect(() => {
        if (activeTab === 'chat' && isAtBottom) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 10);
        }
    }, [messages, isAtBottom, activeTab]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 5) {
            alert("Maximum 5 files allowed per message.");
            return;
        }
        setSelectedFiles((prev) => [...prev, ...files]);
        e.target.value = null;
    };

    const removeSelectedFile = (indexToRemove) => {
        setSelectedFiles((files) => files.filter((_, index) => index !== indexToRemove));
    };

    // Handle Send
    const handleSend = async () => {
        if (!inputText.trim() && selectedFiles.length === 0) return;
        setIsSending(true);

        // FORCE TRIGGER: When YOU send a message, override and force bottom tracking
        setIsAtBottom(true);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        const formData = new FormData();
        if (inputText.trim()) formData.append("text", inputText.trim());

        selectedFiles?.forEach((file) => {
            formData.append("attachments", file);
        });

        setInputText("");
        setSelectedFiles([]);

        await sendMessage(roomId, formData);
        setIsSending(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col bg-[#1A1A1F] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#982598]/10 via-[#1A1A1F] to-[#1A1A1F] text-[#F1E9E9] font-sans overflow-hidden">

            <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            <input type="file" multiple accept="image/*" ref={imageInputRef} className="hidden" onChange={handleFileChange} />

            <div className="flex-none px-4 sm:px-6 py-3 border-b border-white/5 bg-[#1A1A1F]/70 backdrop-blur-xl z-20 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#982598]/20 to-[#E491C9]/20 border border-white/5">
                        <Zap className="w-4 h-4 text-[#E491C9]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-[#F1E9E9]">Workspace Sync</h2>
                        <p className="text-[10px] text-[#E491C9] font-medium tracking-wide">LIVE</p>
                    </div>
                </div>
            </div>

            <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 space-y-6 custom-scrollbar flex flex-col"
            >
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 mt-10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                            <Zap className="w-8 h-8 text-[#E491C9]/50" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-1">It's quiet here...</h3>
                        <p className="text-sm text-white/50 max-w-[250px]">Start the conversation. Send a message, code snippet, or file to your teammates.</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const senderIdStr = msg.senderId?._id || msg.senderId;
                    const senderName = msg.senderId?.fullName || "Unknown";
                    const isMe = senderIdStr === authUser?._id;

                    return (
                        <motion.div
                            key={msg._id || index}
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] md:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md ${
                                    isMe ? 'bg-gradient-to-br from-[#982598] to-[#E491C9] text-white' : 'bg-[#2D2D35] text-[#F1E9E9]/80 border border-white/10'
                                }`}>
                                    {senderName.charAt(0).toUpperCase()}
                                </div>

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <span className="text-[11px] sm:text-xs font-semibold text-[#F1E9E9]/80">
                                            {isMe ? "You" : senderName}
                                        </span>
                                        <span className="text-[9px] sm:text-[10px] text-[#F1E9E9]/40 flex items-center gap-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {isMe && msg.status === "sending" && <Clock className="w-3 h-3 text-white/40" />}
                                            {isMe && msg.status === "sent" && <Check className="w-3 h-3 text-[#E491C9]" />}
                                            {isMe && msg.status === "failed" && <AlertCircle className="w-3 h-3 text-red-400" />}
                                        </span>
                                    </div>

                                    <div className={`px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg backdrop-blur-sm w-fit ${
                                        isMe ? 'bg-gradient-to-br from-[#982598] to-[#E491C9] text-white rounded-2xl rounded-tr-sm' : 'bg-[#25252B] border border-white/5 text-[#F1E9E9]/90 rounded-2xl rounded-tl-sm'
                                    } ${msg.status === "failed" ? 'opacity-50 border-red-500/50' : ''}`}>
                                        {msg.text && (
                                            <p className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                {msg.text}
                                            </p>
                                        )}

                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {msg.attachments.map((att, i) => {
                                                    const fileLink = att.url || att.fileUrl;
                                                    const displayName = att.originalName || att.name || att.fileName || "File Attachment";
                                                    const isImage = att.fileType === 'image' || att.fileType?.startsWith('image/') || fileLink?.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => window.open(fileLink, '_blank')}
                                                            className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl w-fit min-w-[140px] max-w-[220px] ${
                                                                isMe ? 'bg-black/20 hover:bg-black/30' : 'bg-[#1A1A1F]/80 hover:bg-black/40'
                                                            } cursor-pointer transition-all active:scale-95 border border-white/5 shadow-sm`}
                                                            title={displayName}
                                                        >
                                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${isMe ? 'bg-white/20 text-white' : 'bg-[#982598]/20 text-[#E491C9]'}`}>
                                                                {isImage ? <ImageIcon className="w-4 h-4" /> : <FileCode2 className="w-4 h-4" />}
                                                            </div>
                                                            <div className="overflow-hidden flex-1">
                                                                <p className="text-[11px] sm:text-xs font-medium text-[#F1E9E9] truncate">{displayName}</p>
                                                                <p className="text-[9px] sm:text-[10px] text-[#F1E9E9]/50 mt-0.5">Click to view</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                
                <div ref={messagesEndRef} className="h-2 w-full flex-shrink-0" />
            </div>

            <div className="flex-none w-full p-3 sm:p-4 bg-[#1A1A1F]/90 backdrop-blur-md border-t border-white/5 z-10 pb-4 sm:pb-6">
                <div className="mx-auto max-w-4xl bg-[#25252B]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col transition-all focus-within:border-[#E491C9]/50 focus-within:ring-2 focus-within:ring-[#E491C9]/20">
                    <AnimatePresence>
                        {selectedFiles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex gap-2 p-2 overflow-x-auto custom-scrollbar border-b border-white/5 mb-1"
                            >
                                {selectedFiles.map((file, index) => (
                                    <div key={index} className="relative flex items-center gap-2 bg-[#1A1A1F] p-2 rounded-lg border border-white/10 min-w-max group">
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-8 h-8 object-cover rounded" />
                                        ) : (
                                            <FileText className="w-6 h-6 text-[#E491C9]" />
                                        )}
                                        <span className="text-xs text-white/80 max-w-[100px] truncate">{file.name}</span>
                                        <button onClick={() => removeSelectedFile(index)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-end gap-2">
                        <div className="hidden xs:flex items-center gap-1 pb-1 pl-1">
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-[#F1E9E9]/40 hover:text-[#E491C9] hover:bg-[#E491C9]/10 rounded-xl transition-all">
                                <Paperclip className="w-4.5 h-4.5" />
                            </button>
                            <button onClick={() => imageInputRef.current?.click()} className="p-2 text-[#F1E9E9]/40 hover:text-[#E491C9] hover:bg-[#E491C9]/10 rounded-xl transition-all">
                                <ImageIcon className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message workspace..."
                            className="flex-1 max-h-28 min-h-[44px] bg-transparent resize-none outline-none text-[13px] sm:text-sm text-[#F1E9E9] placeholder:text-[#F1E9E9]/40 p-2.5 sm:p-3 custom-scrollbar"
                            rows={1}
                        />

                        <button onClick={() => fileInputRef.current?.click()} className="xs:hidden p-2.5 mb-1 text-[#F1E9E9]/40 hover:text-[#E491C9]">
                            <Paperclip className="w-4.5 h-4.5" />
                        </button>

                        <button
                            onClick={handleSend}
                            disabled={(!inputText.trim() && selectedFiles.length === 0) || isSending}
                            className="p-3 mb-1 mr-1 bg-gradient-to-br from-[#982598] to-[#E491C9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(228,145,201,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            <Send className="w-4 h-4 sm:ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(228, 145, 201, 0.4); }
        @media (min-width: 400px) { .xs\\:flex { display: flex; } .xs\\:hidden { display: none; } }
        @media (max-width: 399px) { .xs\\:flex { display: none; } .xs\\:hidden { display: block; } }
      `}} />
        </div>
    );
}