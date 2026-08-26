import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

export default function LeaveRoomModal({
  isOpen,
  onClose,
  onConfirm,
  isLeaving = false,
  roomName = "this workspace",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLeaving ? onClose : undefined}
            className="fixed inset-0 bg-[#15173D]/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#982598]/30 bg-[#15173D]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Background Ambient Glows */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#982598]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#E491C9]/15 blur-2xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isLeaving}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#F1E9E9]/60 transition-colors hover:bg-white/5 hover:text-[#F1E9E9] disabled:opacity-40"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header & Warning Content */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E491C9]/30 bg-gradient-to-br from-[#982598]/25 to-[#E491C9]/10 text-[#E491C9] shadow-inner">
                <LogOut className="h-6 w-6 translate-x-0.5" />
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[#F1E9E9]">
                Leave Workspace?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#F1E9E9]/70">
                Are you sure you want to disconnect from <span className="font-semibold text-[#F1E9E9]">"{roomName}"</span>? Your live code collaboration session will be ended.
              </p>
            </div>

            {/* Responsive Action Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isLeaving}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#F1E9E9] transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLeaving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#982598] to-[#E491C9] px-5 py-2.5 text-sm font-semibold text-[#F1E9E9] shadow-lg shadow-[#982598]/30 transition-all hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                {isLeaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#F1E9E9] border-t-transparent" />
                    <span>Leaving...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Leave Room</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}