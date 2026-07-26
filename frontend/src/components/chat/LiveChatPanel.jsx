import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Image as ImageIcon, Send, FileCode2, Zap } from 'lucide-react';

// Dummy Data
const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "AlexDev",
    initials: "AD",
    isMe: false,
    text: "Hey, I just updated the WebSocket listeners in the main store. Can you check if the cursors are syncing on your end?",
    timestamp: "10:42 AM",
    type: "text"
  },
  {
    id: 2,
    sender: "You",
    initials: "ME",
    isMe: true,
    text: "Yeah, looks buttery smooth. I'm attaching the updated architecture diagram for the redis implementation.",
    timestamp: "10:44 AM",
    type: "text"
  },
  {
    id: 3,
    sender: "You",
    initials: "ME",
    isMe: true,
    fileName: "redis-arch-v2.png",
    fileSize: "2.4 MB",
    timestamp: "10:44 AM",
    type: "file"
  }
];

export default function LiveChatPanel() {
  const [inputText, setInputText] = useState("");

  return (
    // Swapped to Midnight Slate (#1A1A1F)
    <div className="flex flex-col h-full w-full bg-[#1A1A1F] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#982598]/10 via-[#1A1A1F] to-[#1A1A1F] text-[#F1E9E9] font-sans overflow-hidden">
      
      {/* Floating Glass Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-[#1A1A1F]/70 backdrop-blur-xl sticky top-0 z-20 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#982598]/20 to-[#E491C9]/20 border border-white/5">
            <Zap className="w-4 h-4 text-[#E491C9]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F1E9E9]">Workspace Sync</h2>
            <p className="text-[10px] text-[#E491C9] font-medium tracking-wide">2 ONLINE</p>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar flex flex-col pb-24">
        {DUMMY_MESSAGES.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
            className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] md:max-w-[75%] ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md ${
                msg.isMe 
                  ? 'bg-gradient-to-br from-[#982598] to-[#E491C9] text-white' 
                  : 'bg-[#2D2D35] text-[#F1E9E9]/80 border border-white/10'
              }`}>
                {msg.initials}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {/* Sender Name & Time */}
                <div className={`flex items-baseline gap-2 mb-1 px-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#F1E9E9]/80">
                    {msg.sender}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#F1E9E9]/40">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Bubble - Swapped Teammate bubble to Soft Obsidian (#25252B) */}
                <div className={`p-3 sm:p-4 shadow-lg backdrop-blur-sm ${
                  msg.isMe 
                    ? 'bg-gradient-to-br from-[#982598] to-[#E491C9] text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-[#25252B] border border-white/5 text-[#F1E9E9]/90 rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.type === "text" ? (
                    <p className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : (
                    /* File Attachment UI */
                    <div className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl ${msg.isMe ? 'bg-black/20' : 'bg-[#1A1A1F]/80'} cursor-pointer hover:opacity-80 transition-all active:scale-95 border border-white/5`}>
                      <div className={`p-2 rounded-lg ${msg.isMe ? 'bg-white/20' : 'bg-[#982598]/20 text-[#E491C9]'}`}>
                        <FileCode2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium line-clamp-1">{msg.fileName}</p>
                        <p className="text-[10px] sm:text-[11px] opacity-70 mt-0.5">{msg.fileSize} • Click to open</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-[#1A1A1F] via-[#1A1A1F]/95 to-transparent pb-4 sm:pb-6">
        <div className="mx-auto max-w-4xl flex items-end gap-2 bg-[#25252B]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 focus-within:border-[#E491C9]/50 focus-within:ring-2 focus-within:ring-[#E491C9]/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          
          {/* Upload Actions */}
          <div className="hidden xs:flex items-center gap-1 pb-1 pl-1">
            <button className="p-2 text-[#F1E9E9]/40 hover:text-[#E491C9] hover:bg-[#E491C9]/10 rounded-xl transition-all">
              <Paperclip className="w-4.5 h-4.5" />
            </button>
            <button className="p-2 text-[#F1E9E9]/40 hover:text-[#E491C9] hover:bg-[#E491C9]/10 rounded-xl transition-all">
              <ImageIcon className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Text Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message workspace..."
            className="flex-1 max-h-28 min-h-[44px] bg-transparent resize-none outline-none text-[13px] sm:text-sm text-[#F1E9E9] placeholder:text-[#F1E9E9]/40 p-2.5 sm:p-3 custom-scrollbar"
            rows={1}
          />

          {/* Mobile Upload Button */}
          <button className="xs:hidden p-2.5 mb-1 text-[#F1E9E9]/40 hover:text-[#E491C9]">
             <Paperclip className="w-4.5 h-4.5" />
          </button>

          {/* Send Button */}
          <button 
            disabled={!inputText.trim()}
            className="p-3 mb-1 mr-1 bg-gradient-to-br from-[#982598] to-[#E491C9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(228,145,201,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            <Send className="w-4 h-4 sm:ml-0.5" />
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(228, 145, 201, 0.4); }
        @media (min-width: 400px) { .xs\\:flex { display: flex; } .xs\\:hidden { display: none; } }
        @media (max-width: 399px) { .xs\\:flex { display: none; } .xs\\:hidden { display: block; } }
      `}} />
    </div>
  );
}