import React from 'react';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

export default function EditorHeader({ theme, setTheme, language, setLanguage, activeFile, toggleExplorer, isExplorerOpen }) {
  return (
    <div className="h-14 bg-navy/40 backdrop-blur-md border-b border-brand-purple/20 flex items-center justify-between px-4">
      
      {/* Left: Sidebar Toggle & Active Tab */}
      <div className="flex items-center gap-4">
        <button onClick={toggleExplorer} className="text-ghost-white/50 hover:text-brand-pink transition-colors">
          {isExplorerOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        
        <div className="bg-[#15173D] border-t-2 border-brand-pink text-ghost-white px-4 py-2 rounded-t-lg text-sm font-mono shadow-lg mt-2">
          {activeFile}
        </div>
      </div>

      {/* Right: Settings (Theme & Language) */}
      <div className="flex items-center gap-4">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-navy border border-brand-purple/40 text-ghost-white text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-pink transition-colors cursor-pointer"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          className="bg-navy border border-brand-purple/40 text-ghost-white text-xs rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-pink transition-colors cursor-pointer"
        >
          <option value="vs-dark">VS Dark</option>
          <option value="light">VS Light</option>
          <option value="hc-black">High Contrast</option>
        </select>
      </div>
    </div>
  );
}