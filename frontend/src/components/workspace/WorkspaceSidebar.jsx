import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Presentation, 
  MessageSquare, 
  Info, 
  ArrowLeft, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import useSocketStore from '../../zustand/useSocketStore';
import { useSearchParams } from 'react-router-dom';

export default function WorkspaceSidebar({ activeTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleTabSwitch = (tabName) => {
    setSearchParams((prev) => {
      prev.set('tab', tabName);
      return prev;
    });
  };
  const topOptions = [
    { id: 'editor', label: 'Code Editor', icon: Code2 },
    { id: 'whiteboard', label: 'Whiteboard', icon: Presentation },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare },
    { id: 'info', label: 'Room Info', icon: Info },
  ];

  const handleLeaveRoom = ()=>{
    useSocketStore.getState().disconnect();
  }

  return (
    <div 
      className={`h-full bg-[#15173D]/90 border-r border-[#982598]/30 backdrop-blur-md flex flex-col justify-between py-6 shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-20 lg:w-64'
      }`}
    >
      
      {/* Top Section */}
      <div className="flex flex-col gap-4 px-3">
        
        {/* Header / Collapse Toggle */}
        <div className={`flex items-center mb-6 px-2 ${isCollapsed ? 'justify-center' : 'justify-between hidden lg:flex'}`}>
          {!isCollapsed && (
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F1E9E9] to-[#E491C9] truncate">
              CodeSync
            </h2>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#F1E9E9]/60 hover:text-[#F1E9E9] transition-colors p-1"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}  
          </button>
        </div>

        {/* Navigation Options */}
        {topOptions.map((option) => {
          const isActive = activeTab === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={()=>handleTabSwitch(option.id)}
              title={isCollapsed ? option.label : ""}
              className={`relative flex items-center p-3 rounded-xl transition-colors duration-200 group w-full ${
                isCollapsed ? 'justify-center' : 'justify-center lg:justify-start gap-4'
              } ${
                isActive 
                  ? 'text-[#F1E9E9]' 
                  : 'text-[#F1E9E9]/50 hover:text-[#F1E9E9] hover:bg-[#982598]/10'
              }`}
            >
              {/* Active Background Indicator using Framer Motion */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#982598]/20 border border-[#982598]/50 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <Icon size={24} className="relative z-10 shrink-0" />
              
              {!isCollapsed && (
                <span className="relative z-10 hidden lg:block font-medium truncate">
                  {option.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 px-3">
        <div className="w-full h-px bg-[#982598]/20 my-2"></div>
        
        <button 
          onClick={() => navigate('/dashboard')}
          title={isCollapsed ? "Dashboard" : ""}
          className={`flex items-center p-3 rounded-xl text-[#F1E9E9]/60 hover:text-[#F1E9E9] hover:bg-[#982598]/10 transition-colors w-full ${
            isCollapsed ? 'justify-center' : 'justify-center lg:justify-start gap-4'
          }`}
        >
          <ArrowLeft size={24} className="shrink-0" />
          {!isCollapsed && (
            <span className="hidden lg:block font-medium truncate">Dashboard</span>
          )}
        </button>

        <button 
          onClick={handleLeaveRoom}
          title={isCollapsed ? "Leave Room" : ""}
          className={`flex items-center p-3 rounded-xl text-[#ff4d4d]/70 hover:text-[#ff4d4d] hover:bg-[#ff4d4d]/10 transition-colors w-full ${
            isCollapsed ? 'justify-center' : 'justify-center lg:justify-start gap-4'
          }`}
        >
          <LogOut size={24} className="shrink-0" />
          {!isCollapsed && (
            <span className="hidden lg:block font-medium truncate">Leave Room</span>
          )}
        </button>
      </div>
      
    </div>
  );
}