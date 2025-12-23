import React, { useState } from "react";
import { X, Hash, MessageSquare, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axios"; 
// ^ Ensure this points to your configured axios

const JoinRoomDialog = ({ onClose }) => {
  const [formData, setFormData] = useState({
    inviteCode: "", // or roomId depending on your logic
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.inviteCode.trim()) {
      toast.error("Invite Code is required");
      return;
    }

    setIsLoading(true);
    try {
      // API Call to create the Request
      const res = await axiosInstance.post("/api/rooms/join-request", formData);
      
      if (res.data.success) {
        toast.success("Request sent to Admin!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-xl font-bold text-white">Join a Room</h2>
            <p className="text-slate-400 text-sm mt-1">Enter code to request access</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Input: Invite Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Hash size={16} className="text-blue-400" />
              Room Code / ID
            </label>
            <input
              type="text"
              placeholder="e.g. ROOM-12345"
              value={formData.inviteCode}
              onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Input: Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Request Message <span className="text-slate-500 text-xs">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Hey! I'm part of the frontend team..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-300 font-semibold hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Request</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomDialog;