import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../zustand/authStore';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const [copied, setCopied] = useState(false);
  const { authUser } = useAuthStore();
  const isOwner = authUser?._id === project?.owner;
  const description = project.description || "No description provided for this workspace.";
  const memberCount = project.members?.length || 0;

  const createdDate = new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-sm bg-navy/60 backdrop-blur-xl border border-brand-purple/30 hover:border-brand-pink/60 rounded-3xl p-6 shadow-xl shadow-navy/50 flex flex-col h-full group relative overflow-hidden"
    >
      {/* Background Hover Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl group-hover:bg-brand-pink/20 transition-colors z-0"></div>

      <div className="relative z-10 flex flex-col h-full">

        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-2xl font-bold text-ghost-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple transition-all line-clamp-1">
            {project.name}
          </h3>

          {/* 3. Owner Badge & Tooltip */}
          {isOwner && (
            <div className="relative group/owner flex items-center justify-center shrink-0">
              <div className="bg-brand-purple/20 p-2 rounded-xl border border-brand-purple/40 text-brand-pink shadow-[0_0_10px_rgba(228,145,201,0.2)] transition-colors hover:bg-brand-purple/40">
                {/* Crown Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
                </svg>
              </div>

              {/* Tooltip (Drops down to prevent cutoff from overflow-hidden) */}
              <div className="absolute top-full mt-2 right-0 w-max opacity-0 translate-y-1 group-hover/owner:opacity-100 group-hover/owner:translate-y-0 transition-all duration-200 bg-[#15173D] border border-brand-purple/50 text-ghost-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-20">
                You're the owner
                {/* Tooltip Arrow */}
                <div className="absolute -top-1 right-3 w-2 h-2 bg-[#15173D] border-t border-l border-brand-purple/50 transform rotate-45"></div>
              </div>
            </div>
          )}
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
        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/5">
          <div className="flex gap-3">
            <Link
              to={`/workspace/${project._id}`}
              className="flex flex-1 items-center justify-center bg-brand-purple hover:bg-brand-pink text-ghost-white hover:text-navy px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(152,37,152,0.3)] hover:shadow-[0_0_20px_rgba(228,145,201,0.5)]"
            >
              Enter workspace
            </Link>
          </div>

        </div>
      </div>
    </motion.div>
  );
}