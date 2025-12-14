// src/components/Room/SidebarItem.jsx
import React from "react";

const SidebarItem = ({ Icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      title={label}
      className={`
        relative flex items-center justify-center 
        w-10 h-10 /* Fixed width/height ensures perfect circle */
        transition-all duration-300 ease-out 
        group
        ${isActive 
          ? 'bg-green-500/80 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full scale-80' 
          : 'text-muted hover:bg-white/10 hover:text-white rounded-xl'
        }
      `}
    >
      
      {/* Icon */}
      <Icon 
        size={22} 
        strokeWidth={isActive ? 2.5 : 2}
        className="transition-transform duration-300" 
      />

      
    </button>
  );
};

export default SidebarItem;