import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

export default function Dashboard() {
  // Dummy data simulating the populated Mongoose schema
  const dummyRooms = [
    {
      _id: "60d5ecb8b392",
      name: "React E-Commerce Front",
      roomCode: "REACT-992",
      description: "Building the frontend interface using Vite, Tailwind, and Framer Motion. Need help with the cart state.",
      members: ['id1', 'id2', 'id3', 'id4', 'id5'],
      createdAt: "2026-05-10T10:00:00Z"
    },
    {
      _id: "60d5ecb8b393",
      name: "Node Auth Microservice",
      roomCode: "AUTH-X10",
      description: "Setting up JWT authentication and role-based access control.",
      members: ['id1', 'id2'],
      createdAt: "2026-05-11T14:30:00Z"
    },
    {
      _id: "60d5ecb8b394",
      name: "Python Data Scraper",
      roomCode: "SCRAP-404",
      description: "", // Testing empty description
      members: ['id1'],
      createdAt: "2026-05-12T09:15:00Z"
    }
  ];

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
    <div className="min-h-screen bg-navy font-sans text-ghost-white relative overflow-hidden selection:bg-brand-purple selection:text-ghost-white">
      
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-pink rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">Developer</span>
            </h1>
            <p className="text-ghost-white/60 text-lg">
              Here are your active workspaces. Dive back in.
            </p>
          </div>
          
          <button className="bg-brand-pink text-navy px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(228,145,201,0.4)] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Workspace
          </button>
        </div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dummyRooms.map((room) => (
            <motion.div key={room._id} variants={itemVariants}>
              <ProjectCard project={room} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State Fallback (If no projects exist) */}
        {dummyRooms.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="text-6xl mb-4 opacity-50">📂</div>
            <h3 className="text-2xl font-bold mb-2">No active workspaces</h3>
            <p className="text-ghost-white/60 mb-6">Create a new workspace to start collaborating.</p>
            <button className="bg-brand-purple text-ghost-white px-6 py-2 rounded-full font-bold hover:bg-brand-pink hover:text-navy transition-colors">
              Create First Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}