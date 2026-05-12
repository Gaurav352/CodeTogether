import React from 'react';
import { motion } from 'framer-motion';
import AuthLeftPanel from '../components/auth/AuthLeftPanel';
import AuthForm from '../components/auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden font-sans text-ghost-white selection:bg-brand-pink selection:text-navy">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-pink rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Main Glassmorphism Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-navy/40 backdrop-blur-2xl border border-brand-purple/20 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        <AuthLeftPanel />
        <AuthForm />
      </motion.div>
      
    </div>
  );
}