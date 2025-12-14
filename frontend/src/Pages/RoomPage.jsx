import React, { useState } from 'react';
import { 
  Code2, 
  PenTool, 
  Info, 
  LogOut, 
  Users, 
  Hash 
} from 'lucide-react';
import RoomInfoPlaceholder from '../components/Room/RoomInfoPlaceholder';
import WhiteboardPlaceholder from '../components/Room/WhiteboardPlaceholder';
import CodeSpacePlaceholder from '../components/Room/Codespace/CodeSpacePlaceholder';
import SidebarItem from '../components/Room/SidebarItem';

export default function RoomPage() {
  const [activeTab, setActiveTab] = useState('codespace'); // 'codespace' | 'whiteboard' | 'info'

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-white font-sans">
      
      {/* --- SIDEBAR (Fixed Small Width) --- */}
      <aside className="flex flex-col w-20 bg-surface border-r border-muted/20 z-20 items-center py-4">
        
        {/* 1. Logo (Static) */}
        <div className="h-12 w-12 mb-6 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">
           <Code2 size={24} strokeWidth={2.5} />
        </div>

        {/* 2. Navigation Items */}
        <nav className="flex-1 w-full flex flex-col gap-4 px-3 overflow-hidden items-center">
          
          <SidebarItem 
            Icon={Code2} 
            label="Code Space" 
            expanded={false} // Force collapsed state
            isActive={activeTab === 'codespace'} 
            onClick={() => setActiveTab('codespace')}
          />
          
          <SidebarItem 
            Icon={PenTool} 
            label="Whiteboard" 
            expanded={false} 
            isActive={activeTab === 'whiteboard'} 
            onClick={() => setActiveTab('whiteboard')}
          />
          
          <SidebarItem 
            Icon={Info} 
            label="Room Info" 
            expanded={false} 
            isActive={activeTab === 'info'} 
            onClick={() => setActiveTab('info')}
          />

        </nav>

        {/* 3. Footer / Exit */}
        <div className="mt-auto pt-4 border-t border-muted/20 w-full flex justify-center">
          <button 
            className="h-12 w-12 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent transition-all group"
            title="Leave Room"
          >
            <LogOut size={22} className="group-hover:text-red-400" />
          </button>
        </div>

      </aside>


      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-background">
        
        {/* Dynamic Header */}
        {/* <header className="h-16 border-b border-muted/20 flex items-center px-6 justify-between bg-surface/30 backdrop-blur">
          <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
            <Hash size={20} className="text-secondary" />
            {activeTab === 'codespace' ? 'Code Space' : activeTab === 'whiteboard' ? 'Whiteboard' : 'Room Information'}
          </h2>
          
          {/* Active Users Pill */}
          {/*<div className="flex items-center gap-3 bg-surface px-4 py-1.5 rounded-full border border-muted/30">
            <Users size={16} className="text-muted" />
            <span className="text-xs text-muted font-medium border-l border-muted/30 pl-3">
              <span className="text-white font-bold">3</span> active
            </span>
          </div>
        </header>*/}

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === 'codespace' && <CodeSpacePlaceholder />}
          {activeTab === 'whiteboard' && <WhiteboardPlaceholder />}
          {activeTab === 'info' && <RoomInfoPlaceholder />}
        </div>

      </main>
    </div>
  );
}