import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import useDashboardStore from '../zustand/dashboardStore';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pulling the flags from your Zustand store
  const { rooms, fetchingRooms, fetchRooms, hasFetchedRooms } = useDashboardStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#15173D] font-sans text-[#F1E9E9] relative overflow-hidden selection:bg-[#982598] selection:text-[#F1E9E9]">
      
      {/* Create Workspace Modal Injection */}
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#982598] rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E491C9] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
        
        {/* Single Back Button */}
        <div className="mb-6">
          <Link to="/" aria-label="Back to homepage" className="inline-flex items-center gap-2 bg-white/5 border border-[#982598]/40 text-[#F1E9E9]/80 hover:text-[#E491C9] hover:border-[#E491C9] hover:bg-[#E491C9]/10 px-3 py-2 rounded-xl text-sm font-medium transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden md:inline">Back to Home</span>
          </Link>
        </div>
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E491C9] to-[#982598]">Developer</span>
            </h1>
            <p className="text-[#F1E9E9]/60 text-lg">
              Here are your active workspaces. Dive back in.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E491C9] text-[#15173D] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(228,145,201,0.4)] flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Workspace
          </button>
        </div>

        {/* --- NEW CONDITIONAL RENDERING --- */}
        {fetchingRooms || !hasFetchedRooms ? (
          
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-32 opacity-70">
            <div className="w-12 h-12 border-4 border-[#982598]/30 border-t-[#E491C9] rounded-full animate-spin mb-4"></div>
            <p className="text-[#F1E9E9]/60 font-mono animate-pulse">Syncing workspaces...</p>
          </div>

        ) : (
          
          /* Render Content Only When Ready */
          <>
            {/* Projects Grid */}
            {rooms.length > 0 && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {rooms.map((room) => (
                  <motion.div key={room._id} variants={itemVariants}>
                    <ProjectCard project={room} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State Fallback (If no projects exist) */}
            {rooms.length === 0 && (
              <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="text-6xl mb-4 opacity-50">📂</div>
                <h3 className="text-2xl font-bold mb-2">No active workspaces</h3>
                <p className="text-[#F1E9E9]/60 mb-6">Create a new workspace to start collaborating.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#982598] text-[#F1E9E9] px-6 py-2 rounded-full font-bold hover:bg-[#E491C9] hover:text-[#15173D] transition-colors"
                >
                  Create First Workspace
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}