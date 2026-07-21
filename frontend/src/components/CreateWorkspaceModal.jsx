import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDashboardStore from '../zustand/dashboardStore';

export default function CreateWorkspaceModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {createRoom} = useDashboardStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name.length < 3 || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await createRoom({ name, description }); 
      setName('');
      setDescription('');
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="absolute inset-0 bg-[#15173D]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#15173D] border border-[#982598]/40 rounded-2xl p-8 shadow-[0_0_50px_rgba(152,37,152,0.15)] overflow-hidden"
          >
            {/* Ambient Modal Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#982598] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-[#E491C9] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 text-[#F1E9E9]/50 hover:text-[#E491C9] transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8 relative z-10">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F1E9E9] to-[#E491C9]">
                New Workspace
              </h2>
              <p className="text-[#F1E9E9]/60 mt-2 text-sm">
                Set up a new real-time collaborative environment.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#F1E9E9]/80 block">
                  Workspace Name <span className="text-[#E491C9]">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g., Auth Microservice"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F1E9E9] placeholder-[#F1E9E9]/30 focus:outline-none focus:border-[#E491C9] focus:ring-1 focus:ring-[#E491C9] transition-all disabled:opacity-50"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#F1E9E9]/80 block">
                  Description <span className="text-[#E491C9]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="What is this project about?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#F1E9E9] placeholder-[#F1E9E9]/30 focus:outline-none focus:border-[#E491C9] focus:ring-1 focus:ring-[#E491C9] transition-all resize-none disabled:opacity-50"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-[#982598] to-[#E491C9] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(228,145,201,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Initializing...
                  </>
                ) : (
                  'Create Workspace'
                )}
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}