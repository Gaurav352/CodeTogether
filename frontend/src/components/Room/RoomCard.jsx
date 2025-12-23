import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ roomId,roomName, createdAt, inviteLink }) => {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (

    <div className="group relative flex flex-col justify-between rounded-xl bg-surface border border-muted/20 p-5 shadow-lg transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      
      {/* Top Section: Room Info */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          {/* Room Name */}
          <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1" title={roomName}>
            {roomName}
          </h3>
          
          {/* Status Indicator (Optional decorative element) */}
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
        </div>

        
        
        <p className="text-xs text-muted/70">
          Created on {formatDate(createdAt)}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-muted/20 my-3"></div>

      {/* Bottom Section: Code & Action */}
      <div className="flex items-center gap-3">
        
        {/* Room Code Box */}
        <div 
          onClick={handleCopyCode}
          className="flex-1 flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-muted/30 cursor-pointer group/code hover:border-secondary/50 transition-colors"
          title="Click to copy code"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-muted font-bold tracking-wider">Invite Link</span>
            <code className="text-sm font-mono text-secondary font-semibold">
              {inviteLink}
            </code>
          </div>
          
          {/* Copy Icon / Checkmark */}
          <div className="text-muted group-hover/code:text-secondary transition-colors">
            {copied ? (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary">
                 <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
               </svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
               </svg>
            )}
          </div>
        </div>

        {/* Enter Button */}
        <Link to={`/room/${roomId}`}>
            <button className="h-[46px] px-4 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            </button>
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;