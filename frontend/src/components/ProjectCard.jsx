import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  const [copied, setCopied] = useState(false);

  // Fallbacks based on your schema
  const description = project.description || "No description provided for this workspace.";
  const memberCount = project.members?.length || 0;
  
  // Format the date dynamically
  const createdDate = new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });

  // Handle the copy link action
  const handleCopyLink = () => {
    // Assuming project.inviteLink exists based on the schema
    const linkToCopy = project.inviteLink || `https://codesync.app/join/${project.roomCode}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-navy/60 backdrop-blur-xl border border-brand-purple/30 hover:border-brand-pink/60 rounded-3xl p-6 shadow-xl shadow-navy/50 flex flex-col h-full group relative overflow-hidden"
    >
      {/* Background Hover Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl group-hover:bg-brand-pink/20 transition-colors z-0"></div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header: Name & Code */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-ghost-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple transition-all line-clamp-1">
            {project.name}
          </h3>
          <span className="bg-brand-purple/20 text-brand-pink text-xs px-3 py-1 rounded-full font-mono border border-brand-purple/30">
            {project.roomCode}
          </span>
        </div>

        {/* Meta Info: Date Created & Member Count */}
        <div className="flex items-center gap-4 text-xs font-medium text-ghost-white/50 mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {createdDate}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {memberCount} {memberCount === 1 ? 'Member' : 'Members'}
          </div>
        </div>

        {/* Description */}
        <p className="text-ghost-white/70 text-sm mb-6 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
          
          {/* Copy Invite Link */}
          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 w-full bg-white/5 border border-brand-purple/40 text-ghost-white/80 hover:text-brand-pink hover:border-brand-pink hover:bg-brand-pink/10 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-green-400">Link Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                Copy Invite Link
              </>
            )}
          </button>

          {/* Enter & Leave Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-transparent hover:bg-red-500/10 text-ghost-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/50 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
              Leave
            </button>
            <button className="flex-1 bg-brand-purple hover:bg-brand-pink text-ghost-white hover:text-navy px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(152,37,152,0.3)] hover:shadow-[0_0_20px_rgba(228,145,201,0.5)]">
              Enter Room
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}