import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar';


export default function Workspace() {
  const [activeTab, setActiveTab] = useState('editor');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'editor':
        return <div className="text-ghost-white p-8">Code Editor Component goes here...</div>; 
      case 'whiteboard':
        return <div className="text-ghost-white p-8">Whiteboard Component goes here...</div>; 
      case 'chat':
        return <div className="text-ghost-white p-8">Live Chat Component goes here...</div>; 
      case 'info':
        return <div className="text-ghost-white p-8">Room Info Component goes here...</div>; 
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-navy overflow-hidden">
      {/* Sidebar Navigation */}
      <WorkspaceSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* <WorkspaceHeader /> */}
        
        {/* Dynamic View Rendering with Framer Motion */}
        <div className="flex-1 overflow-y-auto bg-navy/90 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}