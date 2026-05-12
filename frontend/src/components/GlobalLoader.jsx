import React from 'react';
import { motion } from 'framer-motion';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full"
      />

      <div className="relative flex flex-col items-center">
        <div className="relative flex items-center justify-center w-32 h-32">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border-2 border-brand-pink rounded-xl rotate-45"
          />

          {/* Animated SVG Path (The "Sync" Pulse) */}
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="z-10">
            <motion.path
              d="M7 8L3 12L7 16M17 8L21 12L17 16"
              stroke="#E491C9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5
              }}
            />
            <motion.path
              d="M14 4L10 20"
              stroke="#982598"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
                repeatDelay: 0.5
              }}
            />
          </svg>
        </div>

        <div className="mt-10 text-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tracking-[0.5em] text-ghost-white ml-[0.5em]"
          >
            CODE<span className="text-brand-purple">SYNC</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-brand-pink to-transparent mt-2"
          />
        </div>

        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-[10px] uppercase tracking-[0.3em] text-brand-pink/60 font-mono"
        >
          Establishing_Secure_Link
        </motion.p>
      </div>
    </div>
  );
};

export default GlobalLoader;