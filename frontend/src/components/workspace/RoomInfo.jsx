import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FolderGit2, Link2, Copy, CheckCircle2, 
  TerminalSquare, CalendarDays, Fingerprint, 
  UserPlus, Sparkles, ShieldCheck 
} from 'lucide-react';
import useWorkspaceStore from '../../zustand/useWorkspaceStore';
import InviteModal from './InviteModal';
import toast from 'react-hot-toast';

const RoomInfo = () => {
  const { currentRoom } = useWorkspaceStore();
  const [copied, setCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const room = currentRoom ?? {
    name: '',
    description: '',
    roomCode: '',
    inviteLink: '',
    createdAt: Date.now(),
    members: [],
    folders: [],
    owner: {},
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-navy text-ghost-white p-6 lg:p-10 custom-scrollbar relative z-10">
      
      {/* Ambient Background Glows to eliminate flat boxiness */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[30%] h-[30%] bg-brand-pink/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        {/* Elegant Floating Header */}
        <motion.div 
          variants={itemVariants} 
          className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-pink/30 blur-xl rounded-full" />
              <div className="relative p-5 bg-gradient-to-br from-brand-purple/40 to-navy border border-brand-pink/30 rounded-full shadow-[0_0_20px_rgba(228,145,201,0.2)]">
                <TerminalSquare className="w-10 h-10 text-brand-pink" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-ghost-white via-brand-pink to-brand-purple bg-clip-text text-transparent pb-1">
                {room?.name || "Workspace"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-ghost-white/70 text-sm mt-3 font-mono">
                <span className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                  <Fingerprint className="w-4 h-4 text-brand-pink" /> Code: <span className="text-brand-pink font-bold">{room.roomCode}</span>
                </span>
                <span className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                  <CalendarDays className="w-4 h-4 text-brand-purple" /> {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Fully rounded Action Button */}
          <div className="relative z-10 flex-shrink-0">
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 transition-all rounded-full font-bold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(152,37,152,0.4)] hover:scale-[1.05] active:scale-95 text-ghost-white"
            >
              <UserPlus className="w-5 h-5" />
              Invite Collaborators
            </button>
          </div>
        </motion.div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Overview & Stats Column */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Soft-edged Description Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group flex-1">
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-brand-purple/20 rounded-full blur-[60px] transition-transform duration-700 group-hover:scale-150" />
              <h2 className="text-xl font-bold tracking-wide mb-5 flex items-center gap-3 text-ghost-white">
                <Sparkles className="w-6 h-6 text-brand-pink" /> 
                Workspace Overview
              </h2>
              <p className="text-ghost-white/80 leading-relaxed text-base">
                {room.description || "No description provided for this workspace. Time to build collaborative applications!"}
              </p>
            </div>
            
            {/* Quick Metrics - Floating Pills instead of square grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-5 bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-md p-5 rounded-full border border-white/10 shadow-lg">
                <div className="p-4 bg-brand-pink/10 rounded-full shadow-[0_0_15px_rgba(228,145,201,0.2)]">
                  <Users className="w-6 h-6 text-brand-pink" />
                </div>
                <div>
                  <div className="text-3xl font-black text-ghost-white">{(room.members?.length || 0) + 1}</div>
                  <div className="text-sm font-medium text-ghost-white/50">Total Engineers</div>
                </div>
              </div>

              <div className="flex items-center gap-5 bg-gradient-to-br from-white/5 to-black/20 backdrop-blur-md p-5 rounded-full border border-white/10 shadow-lg">
                <div className="p-4 bg-brand-purple/10 rounded-full shadow-[0_0_15px_rgba(152,37,152,0.2)]">
                  <FolderGit2 className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <div className="text-3xl font-black text-ghost-white">{room.folders?.length || 0}</div>
                  <div className="text-sm font-medium text-ghost-white/50">Project Nodes</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Collaborators Column */}
          <motion.div variants={itemVariants} className="lg:col-span-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-brand-purple/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-bold flex items-center gap-3 text-ghost-white">
                <ShieldCheck className="w-6 h-6 text-brand-purple" /> 
                Active Crew
              </h2>
              <span className="text-xs font-mono font-bold text-brand-pink bg-brand-pink/10 px-4 py-1.5 rounded-full border border-brand-pink/20">
                {(room.members?.length || 0) + 1} Seats
              </span>
            </div>

            {/* List format replaces the boxy grid format */}
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 relative z-10 pr-2">
              
              {/* Workspace Admin */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-brand-purple/20 to-transparent border border-brand-purple/30 rounded-[1.5rem] group hover:border-brand-purple/50 transition-all">
                <div className="w-14 h-14 rounded-full bg-brand-purple flex items-center justify-center font-bold text-xl text-ghost-white shadow-[0_0_20px_rgba(152,37,152,0.5)] group-hover:scale-105 transition-transform">
                  {room.owner?.fullName?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-bold truncate text-ghost-white">{room.owner?.fullName || 'Room Owner'}</span>
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-bold mt-0.5">Workspace Creator</span>
                </div>
              </div>

              {/* Members List */}
              {room.members?.map((member, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[1.5rem] transition-all group">
                  <div className="w-14 h-14 rounded-full bg-navy border-2 border-white/10 flex items-center justify-center font-bold text-xl text-ghost-white group-hover:border-brand-pink/50 transition-colors">
                    {member?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-semibold truncate text-ghost-white group-hover:text-brand-pink transition-colors">{member?.fullName || 'Collaborator'}</span>
                    <span className="text-xs text-ghost-white/40 uppercase tracking-widest mt-0.5">Engineer</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Binded Modal Component */}
      <InviteModal 
        isOpen={isInviteOpen} 
        onClose={() => setIsInviteOpen(false)} 
        roomCode={room.roomCode}
      />
    </div>
  );
};

export default RoomInfo;