import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../zustand/authStore';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Loader2, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useWorkspaceStore from '../zustand/useWorkspaceStore';

export default function JoinWorkspace() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const location = useLocation(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const {acceptInvite}=useWorkspaceStore();


  useEffect(() => {
    if (!token) return;
    if (!authUser) {
      const currentUrl = `/join?token=${token}`;
      navigate(`/authPage?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
  }, [token, authUser, navigate]);

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!token) {
        toast.error("Invalid invitation link");
        return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res=await acceptInvite(token);
      if(res){
        navigate(`/workspace/${res}`);
      } else {
        navigate('/dashboard');
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Secondary Action: Decline/Ignore Invitation
  const handleDecline = (e) => {
    e.preventDefault();
    setIsDeclining(true);
    
    // We do not need a backend call to decline if invites auto-expire,
    // but you can add one here if you want to mark the token as 'REVOKED' in the DB.
    toast("Invitation ignored.", { icon: "👋", style: { background: '#1A1A1F', color: '#fff' }});
    
    setTimeout(() => {
      navigate('/dashboard'); // Route user safely back to their dashboard
    }, 500);
  };

  // Edge Case: Missing Token UI (Prevents blank screens or crashes)
  if (!token) {
      return (
        <div className="flex h-screen items-center justify-center bg-[#121212] text-ghost-white px-4">
          <div className="p-6 sm:p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-center max-w-sm w-full">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-400 mb-2">Invalid Link</h2>
            <p className="text-ghost-white/60 text-sm">No invitation token was found in the URL. Please ensure you clicked the full link.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#121212] text-ghost-white px-4 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-purple/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full max-w-md p-6 sm:p-8 bg-white/5 border border-white/10 rounded-3xl text-center shadow-[0_0_40px_rgba(152,37,152,0.15)] backdrop-blur-md relative z-10"
      >
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-brand-purple/20 to-navy rounded-2xl border border-brand-purple/40 shadow-[0_0_20px_rgba(152,37,152,0.2)]">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-brand-pink" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-ghost-white via-brand-pink to-brand-purple bg-clip-text text-transparent">
          Workspace Invitation
        </h2>
        <p className="text-ghost-white/70 mb-8 text-[13px] sm:text-sm leading-relaxed px-2">
          You have been invited to collaborate in a secure workspace. Click below to accept the invitation and sync up with the team.
        </p>

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-3">
          {/* HUGE Accept Button */}
          <button
            onClick={handleAccept}
            disabled={isSubmitting || isDeclining}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 text-ghost-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Accept Invitation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* SMALL Muted Ignore Button */}
          <button
            onClick={handleDecline}
            disabled={isSubmitting || isDeclining}
            className="w-full flex items-center justify-center gap-2 text-ghost-white/50 hover:text-ghost-white/90 hover:bg-white/5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeclining ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>Ignore & Return to Dashboard</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}