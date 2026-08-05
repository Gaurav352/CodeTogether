import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FolderGit2, Link2, Copy, CheckCircle2, 
  TerminalSquare, CalendarDays, Fingerprint 
} from 'lucide-react';

const RoomInfo = ({ roomData }) => {
  const [copied, setCopied] = useState(false);
  const room = roomData || {
    name: "CodeSync Core Engine",
    roomCode: "SYNC-88X2",
    description: "Main workspace for developing the real-time collaboration features and Yjs CRDT implementations.",
    owner: { name: "Admin User" },
    members: [{ name: "Alice Dev" }, { name: "Bob Coder" }, { name: "Charlie Web" }],
    folders: [1, 2, 3], 
    inviteLink: "https://localhost:5173/join/SYNC-88X2",
    createdAt: new Date().toISOString()
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(room.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-navy text-ghost-white p-6 lg:p-12 custom-scrollbar">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-purple/20 rounded-xl border border-brand-purple/50 shadow-[0_0_15px_rgba(152,37,152,0.3)]">
            <TerminalSquare className="w-8 h-8 text-brand-pink" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-ghost-white via-brand-pink to-brand-purple bg-clip-text text-transparent">
              {room.name}
            </h1>
            <p className="text-ghost-white/50 text-sm flex items-center gap-2 mt-1">
              <Fingerprint className="w-4 h-4" /> Room Identity Code: <span className="font-mono text-brand-pink">{room.roomCode}</span>
            </p>
          </div>
        </motion.div>

        {/* Top Grid: Info & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Workspace Overview
            </h2>
            <p className="text-ghost-white/70 leading-relaxed mb-6">
              {room.description || "No description provided for this workspace. Time to write some code!"}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-ghost-white/50 border-t border-white/10 pt-4 mt-auto">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand-purple" />
                Created {new Date(room.createdAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats & Invite Link */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Invite Module */}
            <div className="bg-gradient-to-br from-brand-purple/20 to-navy border border-brand-purple/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(152,37,152,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Link2 className="w-24 h-24" />
              </div>
              <h3 className="font-semibold mb-2 relative z-10">Invite Link</h3>
              <p className="text-xs text-ghost-white/60 mb-4 relative z-10">Share this encrypted link to invite collaborators instantly.</p>
              
              <div className="flex items-center bg-navy/80 border border-white/10 rounded-lg overflow-hidden relative z-10">
                <input 
                  type="text" 
                  readOnly 
                  value={room.inviteLink} 
                  className="bg-transparent w-full px-3 py-2 text-xs font-mono text-ghost-white/80 outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 transition-colors border-l border-white/10"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-brand-pink" />}
                </button>
              </div>
            </div>

            {/* Stats Module */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                <Users className="w-6 h-6 text-brand-pink mb-2" />
                <span className="text-2xl font-bold">{room.members?.length || 0}</span>
                <span className="text-xs text-ghost-white/50">Engineers</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                <FolderGit2 className="w-6 h-6 text-brand-purple mb-2" />
                <span className="text-2xl font-bold">{room.folders?.length || 0}</span>
                <span className="text-xs text-ghost-white/50">Nodes</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Members Roster */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Active Collaborators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* The Owner is always first */}
            <div className="flex items-center gap-3 p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center font-bold shadow-[0_0_10px_rgba(152,37,152,0.5)]">
                {room.owner?.name?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{room.owner?.name || 'Owner'}</span>
                <span className="text-[10px] text-brand-pink uppercase tracking-wider">Admin</span>
              </div>
            </div>

            {/* Loop through the rest of the members */}
            {room.members?.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl cursor-default">
                <div className="w-10 h-10 rounded-full bg-navy border border-white/20 flex items-center justify-center font-medium text-brand-pink">
                  {member?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm truncate">{member?.name || 'Unknown User'}</span>
                  <span className="text-[10px] text-ghost-white/40">Member</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default RoomInfo;