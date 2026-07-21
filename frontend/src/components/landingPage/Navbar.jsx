import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../zustand/authStore';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {authUser} = useAuthStore();
  console.log(authUser);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-navy/70 backdrop-blur-md border border-brand-purple/30 rounded-full py-3 px-6 md:px-8 z-50 shadow-2xl shadow-navy/50"
    >
      <div className="flex justify-between items-center w-full">
        
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tighter md:flex-1 cursor-pointer">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">Code</span>
          <span className="text-ghost-white">Sync</span>
        </div>

        {/* Desktop Links (Centered) */}
        <div className="hidden md:flex md:flex-1 items-center justify-center space-x-8">
          <a href="#features" className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors">Features</a>
          <a href="#working" className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors">Working</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex md:flex-1 items-center justify-end space-x-4">
          {!authUser && 
            <Link
            to={"/authPage"}
            className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors">
              Login
            </Link>}
          {authUser && <Link to={"dashboard"} className="bg-ghost-white text-navy px-5 py-2 rounded-full hover:bg-brand-pink transition-colors font-bold shadow-[0_0_15px_rgba(228,145,201,0.4)]">
            Get Started
          </Link>}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-ghost-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown (Glassmorphism) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[120%] left-0 w-full bg-navy/90 backdrop-blur-xl border border-brand-purple/30 rounded-3xl flex flex-col items-center py-6 space-y-6 shadow-2xl"
          >
            <a href="#features" className="text-ghost-white font-medium">Features</a>
            <a href="#working" className="text-ghost-white font-medium">Working</a>
            {(!authUser) && <Link to={"/authPage"} className="text-ghost-white font-medium">Login</Link>}
            {authUser && <Link to={"/dashboard"} className="w-[80%] bg-brand-purple text-ghost-white py-3 rounded-full font-bold">Get Started</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}