import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../zustand/authStore';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { authUser, logout } = useAuthStore(); 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

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

        {/* Desktop Links */}
        <div className="hidden md:flex md:flex-1 items-center justify-center space-x-8">
          <a href="#features" className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors">Features</a>
          <a href="#working" className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors">Working</a>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex md:flex-1 items-center justify-end space-x-4">
          {!authUser ? (
            <Link
              to={"/authPage"}
              className="text-sm font-medium text-ghost-white hover:text-brand-pink transition-colors"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-4 relative" ref={profileRef}>
              <Link 
                to={"/dashboard"} 
                className="bg-ghost-white text-navy px-5 py-2 rounded-full hover:bg-brand-pink transition-colors font-bold shadow-[0_0_15px_rgba(228,145,201,0.4)]"
              >
                Dashboard
              </Link>
              
              {/* Profile Avatar Button */}
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 aspect-square rounded-full bg-ghost-white text-navy font-bold inline-flex items-center justify-center border-2 border-transparent hover:border-ghost-white transition-all shadow-lg focus:outline-none overflow-hidden leading-none p-0 flex-shrink-0 align-middle cursor-pointer"
              >
                {getInitials(authUser?.fullName || authUser?.name)}
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[120%] w-64 bg-navy/95 backdrop-blur-xl border border-brand-purple/30 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-5 py-4 border-b border-brand-purple/20">
                      <p className="text-ghost-white font-bold truncate">
                        {authUser?.fullName || authUser?.name || 'User'}
                      </p>
                      <p className="text-ghost-white/60 text-sm truncate mt-0.5">
                        {authUser?.email || 'user@example.com'}
                      </p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          if(logout) logout();
                        }}
                        className="w-full text-left px-3 py-2.5 text-brand-pink hover:bg-brand-pink/10 rounded-xl transition-colors font-semibold flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden text-ghost-white focus:outline-none z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-[120%] left-0 w-full bg-navy/95 backdrop-blur-xl border border-brand-purple/30 rounded-3xl flex flex-col items-center py-8 space-y-6 shadow-2xl"
          >
            {authUser && (
              <div className="w-full flex flex-col items-center pb-6 border-b border-brand-purple/20 px-6">
                <div className="w-16 h-16 rounded-full bg-ghost-white text-navy font-bold flex items-center justify-center text-2xl mb-4 shadow-lg cursor-pointer">
                  {getInitials(authUser?.fullName || authUser?.name)}
                </div>
                <p className="text-ghost-white font-bold text-lg text-center w-full truncate">
                  {authUser?.fullName || authUser?.name || 'User'}
                </p>
                <p className="text-ghost-white/60 text-sm text-center w-full truncate">
                  {authUser?.email || 'user@example.com'}
                </p>
              </div>
            )}

            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-ghost-white font-medium hover:text-brand-pink">Features</a>
            <a href="#working" onClick={() => setIsMenuOpen(false)} className="text-ghost-white font-medium hover:text-brand-pink">Working</a>
            
            {!authUser ? (
              <Link to={"/authPage"} onClick={() => setIsMenuOpen(false)} className="text-brand-pink font-bold">Login</Link>
            ) : (
              <div className="w-full flex flex-col items-center space-y-4 px-6 pt-2">
                <Link 
                  to={"/dashboard"} 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-center bg-ghost-white text-navy py-3 rounded-full font-bold hover:bg-brand-pink hover:text-ghost-white transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    if(logout) logout();
                  }}
                  className="w-full text-center border-2 border-brand-pink/50 text-brand-pink py-3 rounded-full font-bold hover:bg-brand-pink/10 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}