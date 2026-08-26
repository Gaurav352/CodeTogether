import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send } from 'lucide-react';
import useWorkspaceStore from '../../zustand/useWorkspaceStore';
import toast from 'react-hot-toast';

export default function InviteModal({ isOpen, onClose ,roomCode}) {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]);
  const [isSending, setIsSending] = useState(false);
  // no direct roomId needed here; `sendInvites` reads roomId from the store

  const handleKeyDown = (e) => {
    if (['Enter', ',', ' '].includes(e.key)) {
      e.preventDefault();
      const trimmed = emailInput.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (trimmed && emailRegex.test(trimmed) && !emails.includes(trimmed)) {
        setEmails((prev) => [...prev, trimmed]);
        setEmailInput('');
      }
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const sendInvites = useWorkspaceStore((s) => s.sendInvites);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pending = emailInput.trim();
    const all = pending ? [...emails, pending.toLowerCase()] : [...emails];
    const normalized = all.map((x) => (x || '').trim().toLowerCase()).filter(Boolean);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = Array.from(new Set(normalized)).filter((e) => emailRegex.test(e));

    if (validEmails.length === 0) {
      toast.error('Enter at least one valid email address');
      return;
    }

    setIsSending(true);
    try {
      const ok = await sendInvites(validEmails);
      if (ok) {
        toast.success('Invites sent successfully');
        setEmails([]);
        setEmailInput('');
        onClose();
      } 
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-lg bg-navy border border-brand-purple/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(152,37,152,0.3)] z-10 space-y-6 text-ghost-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-purple/20 rounded-xl border border-brand-purple/40 text-brand-pink">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Invite Collaborators</h3>
                  <p className="text-xs text-ghost-white/50">Send direct email invitations for room <span className="font-mono text-brand-pink">{roomCode}</span></p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-ghost-white/60 hover:text-ghost-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-ghost-white/70">
                  Recipient Emails (Press Enter, Space, or Comma to add)
                </label>

                {/* Tag Cloud & Input Container */}
                <div className="min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-brand-pink transition-all flex flex-wrap gap-2 items-start max-h-40 overflow-y-auto custom-scrollbar">
                  {emails.map((email, idx) => (
                    <span 
                      key={idx} 
                      className="bg-brand-purple/30 border border-brand-purple/50 text-ghost-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                    >
                      {email}
                      <button 
                        type="button" 
                        onClick={() => removeEmail(email)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  
                  <input 
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={emails.length === 0 ? "developer@company.com..." : "Add another..."}
                    className="bg-transparent flex-1 min-w-[140px] text-sm text-ghost-white outline-none p-1 placeholder:text-ghost-white/30"
                  />
                </div>
                <p className="text-[11px] text-ghost-white/40">Multiple emails will be sent individual workspace links.</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-ghost-white/70 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={emails.length === 0 || isSending}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 disabled:opacity-40 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : `Send Invites (${emails.length})`}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}