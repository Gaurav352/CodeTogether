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
    <div className="h-full w-full overflow-y-auto bg-navy text-ghost-white p-6 lg:p-10 custom-scrollbar relative">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header Banner Section */}
        <motion.div 
          variants={itemVariants} 
          className="relative overflow-hidden bg-gradient-to-r from-brand-purple/20 via-navy to-navy border border-brand-purple/30 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(152,37,152,0.15)]"
        >
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-brand-purple/30 rounded-2xl border border-brand-pink/30 shadow-[0_0_20px_rgba(228,145,201,0.2)]">
                <TerminalSquare className="w-10 h-10 text-brand-pink" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-ghost-white via-brand-pink to-brand-purple bg-clip-text text-transparent">
                  {room?.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-ghost-white/60 text-xs sm:text-sm mt-2 font-mono">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Fingerprint className="w-4 h-4 text-brand-pink" /> Code: <span className="text-brand-pink font-bold">{room.roomCode}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <CalendarDays className="w-4 h-4 text-brand-purple" /> {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInviteOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 transition-all rounded-xl font-semibold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(152,37,152,0.4)] hover:scale-[1.02] active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                Invite Collaborators
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Grid: Overview & Interactive Share */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <div>
              <h2 className="text-lg font-bold tracking-wide mb-3 flex items-center gap-2 text-ghost-white">
                <Sparkles className="w-5 h-5 text-brand-pink" /> Workspace Overview
              </h2>
              <p className="text-ghost-white/70 leading-relaxed text-sm lg:text-base">
                {room.description || "No description provided for this workspace. Time to build collaborative applications!"}
              </p>
            </div>
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6">
              <div className="flex items-center gap-4 bg-navy/60 p-4 rounded-2xl border border-white/5">
                <div className="p-3 bg-brand-pink/10 rounded-xl">
                  <Users className="w-6 h-6 text-brand-pink" />
                </div>
                <div>
                  <div className="text-2xl font-black text-ghost-white">{(room.members?.length || 0) + 1}</div>
                  <div className="text-xs text-ghost-white/50">Total Engineers</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-navy/60 p-4 rounded-2xl border border-white/5">
                <div className="p-3 bg-brand-purple/10 rounded-xl">
                  <FolderGit2 className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                  <div className="text-2xl font-black text-ghost-white">{room.folders?.length || 0}</div>
                  <div className="text-xs text-ghost-white/50">Project Nodes</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Share Link Box */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/5 to-brand-purple/10 border border-white/10 rounded-3xl p-6 flex flex-col justify-between relative">
            <div>
              <div className="p-3 bg-brand-purple/20 w-fit rounded-xl border border-brand-purple/40 mb-4">
                <Link2 className="w-6 h-6 text-brand-pink" />
              </div>
              <h3 className="font-bold text-lg mb-1">Encrypted Share Link</h3>
              <p className="text-xs text-ghost-white/60 mb-6">Direct access link for authorized team members to bypass room identity keys.</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center bg-navy/90 border border-white/10 rounded-xl overflow-hidden p-1.5 focus-within:border-brand-purple transition-all">
                <input 
                  type="text" 
                  readOnly 
                  value={room.inviteLink} 
                  className="bg-transparent w-full px-3 text-xs font-mono text-ghost-white/80 outline-none truncate"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Collaborators Section */}
        <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-purple" /> Active Roster
            </h2>
            <span className="text-xs font-mono text-ghost-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {(room.members?.length || 0) + 1} Seats Claimed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Workspace Admin */}
            <div className="flex items-center gap-3 p-3.5 bg-brand-purple/15 border border-brand-purple/30 rounded-2xl relative group">
              <div className="w-11 h-11 rounded-xl bg-brand-purple flex items-center justify-center font-bold text-lg shadow-[0_0_12px_rgba(152,37,152,0.6)]">
                {room.owner?.fullName?.charAt(0).toUpperCase() || 'O'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate text-ghost-white">{room.owner?.fullName || 'Room Owner'}</span>
                <span className="text-[10px] text-brand-pink uppercase tracking-widest font-bold">Workspace Creator</span>
              </div>
            </div>

            {/* Members List */}
            {room.members?.map((member, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                <div className="w-11 h-11 rounded-xl bg-navy border border-white/20 flex items-center justify-center font-bold text-brand-pink">
                  {member?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate text-ghost-white">{member?.fullName || 'Collaborator'}</span>
                  <span className="text-[10px] text-ghost-white/40 uppercase tracking-widest">Engineer</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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