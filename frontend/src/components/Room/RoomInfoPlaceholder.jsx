import React, { useState } from "react";
import { 
  Info, Copy, Check, ExternalLink, Calendar, Users, Hash, 
  UserPlus, Mail, X, CheckCircle 
} from "lucide-react";
import useRoomStore from "../../zustand/roomStore";

// --- MOCK DATA FOR UI DEV (Replace with actual data later) ---
const MOCK_REQUESTS = [
  {
    _id: "req1",
    sender: {
      fullname: "Ishika Patel",
      email: "ishika@example.com",
      avatar: "" // Empty string simulates no avatar
    },
    message: "Hey! I am from the frontend team, need access to fix the navbar bugs.",
    createdAt: "2024-03-10T10:00:00Z"
  },
  {
    _id: "req2",
    sender: {
      fullname: "Rahul Sharma",
      email: "rahul.dev@example.com",
      avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=random"
    },
    message: "Joining for the SIH hackathon collaboration.",
    createdAt: "2024-03-11T14:30:00Z"
  }
];

const RoomInfoPlaceholder = () => {
  const { currentRoom } = useRoomStore();
  const [copiedField, setCopiedField] = useState(null);

  // Helper to handle copying text
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Guard clause
  if (!currentRoom) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* ================= EXISTING ROOM DETAILS CARD ================= */}
      <div className="bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Info size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Room Details</h3>
            <p className="text-slate-400 text-xs">Metadata and access information</p>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          
          {/* Room Name */}
          <div className="pb-4 border-b border-slate-700/50 space-y-2">
            <div className="flex justify-between items-start">
               <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Project Name</span>
               <span className="text-white font-bold text-lg text-right">{currentRoom.name}</span>
            </div>
            {currentRoom.description && (
                <p className="text-sm text-slate-400/60 text-right italic">
                  "{currentRoom.description}"
                </p>
            )}
          </div>

          {/* Room Code */}
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
            <span className="text-slate-400 text-sm flex items-center gap-2">
                <Hash size={14} /> Room Code
            </span>
            <button 
              onClick={() => handleCopy(currentRoom.roomCode, 'code')}
              className="group flex items-center gap-2 bg-[#0F172A] border border-slate-700 hover:border-blue-500/50 px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              <code className="text-purple-400 font-mono tracking-widest text-sm">
                {currentRoom.roomCode}
              </code>
              {copiedField === 'code' ? (
                 <Check size={14} className="text-green-400" />
              ) : (
                 <Copy size={14} className="text-slate-500 group-hover:text-white" />
              )}
            </button>
          </div>

          {/* Invite Link */}
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
            <span className="text-slate-400 text-sm flex items-center gap-2">
                <ExternalLink size={14} /> Invite Link
            </span>
            <button 
              onClick={() => handleCopy(currentRoom.inviteLink, 'link')}
              className="group flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
              title={currentRoom.inviteLink}
            >
              <span className="text-blue-400 text-sm underline decoration-blue-400/30 truncate max-w-[150px] md:max-w-[250px]">
                {currentRoom.inviteLink}
              </span>
              {copiedField === 'link' ? (
                 <Check size={14} className="text-green-400" />
              ) : (
                 <Copy size={14} className="text-slate-500 group-hover:text-white" />
              )}
            </button>
          </div>

          {/* Owner */}
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
            <span className="text-slate-400 text-sm">Owner</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg"></div>
              <span className="text-white text-sm font-medium">
                 {typeof currentRoom.owner === 'string' 
                    ? `User ...${currentRoom.owner.slice(-4)}` 
                    : currentRoom.owner?.name || "Unknown"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-1">
             <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-2 rounded-full border border-slate-700">
                <Users size={14} />
                <span>{currentRoom.members?.length || 0} Members</span>
             </div>
             <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>Created {formatDate(currentRoom.createdAt)}</span>
             </div>
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ================= NEW: PENDING REQUESTS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-slate-300 font-semibold flex items-center gap-2">
            <UserPlus size={18} className="text-orange-400" />
            Pending Requests
            <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-500/20">
              {MOCK_REQUESTS.length}
            </span>
          </h4>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {MOCK_REQUESTS.map((req) => (
            <div key={req._id} className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center group">
              
              {/* Avatar & Info */}
              <div className="flex items-start gap-3 flex-1">
                {/* Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                  {req.sender.avatar ? (
                    <img src={req.sender.avatar} alt="av" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-slate-300 font-bold text-sm">
                      {req.sender.fullname.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Text Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-white font-medium text-sm">{req.sender.fullname}</h5>
                    <span className="text-slate-500 text-[10px] hidden sm:inline-block">• {formatDate(req.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Mail size={10} />
                    <span>{req.sender.email}</span>
                  </div>

                  {/* Purpose Message */}
                  <div className="bg-[#0F172A] p-2 rounded-lg border border-slate-700/50 mt-2 max-w-md">
                    <p className="text-xs text-slate-300 italic">"{req.message}"</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/50">
                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-semibold rounded-lg border border-green-500/20 transition-all active:scale-95"
                  title="Accept Request"
                >
                  <CheckCircle size={14} />
                  <span className="md:hidden">Accept</span>
                </button>

                <button 
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 transition-all active:scale-95"
                  title="Reject Request"
                >
                  <X size={14} />
                  <span className="md:hidden">Reject</span>
                </button>
              </div>

            </div>
          ))}

          {/* Empty State (Visual Only) */}
          {MOCK_REQUESTS.length === 0 && (
             <div className="text-center py-8 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                <UserPlus size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending requests</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RoomInfoPlaceholder;