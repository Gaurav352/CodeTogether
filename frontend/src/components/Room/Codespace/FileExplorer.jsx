import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  MoreVertical 
} from 'lucide-react';
import FileNode from './FileNode';


const FileExplorer = ({ isOpen }) => {
  // Mock State for folder toggling
  const [folders, setFolders] = useState({ src: true, components: false });

  const toggleFolder = (name) => {
    setFolders(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!isOpen) return null;

  return (
    <div className="w-60 h-full bg-[#0F172A] border-r border-muted/20 flex flex-col shrink-0 transition-all duration-300">
       
       {/* Explorer Header */}
       <div className="h-12 flex items-center justify-between px-4 border-b border-muted/20">
           <span className="text-xs font-bold text-muted uppercase tracking-wider">Explorer</span>
           <div className="flex gap-2 text-muted">
               <button className="hover:text-white"><Plus size={16} /></button>
               <button className="hover:text-white"><MoreVertical size={16} /></button>
           </div>
       </div>

       {/* File Tree */}
       <div className="flex-1 overflow-y-auto py-2">
           <FileNode 
             name="src" 
             type="folder" 
             isOpen={folders['src']} 
             onToggle={() => toggleFolder('src')} 
           />
           
           {/* Recursive Children Mock */}
           {folders['src'] && (
             <>
                <FileNode 
                  name="components" 
                  type="folder" 
                  depth={1} 
                  isOpen={folders['components']} 
                  onToggle={() => toggleFolder('components')} 
                />
                {folders['components'] && (
                   <>
                      <FileNode name="Header.jsx" type="file" depth={2} />
                      <FileNode name="Sidebar.jsx" type="file" depth={2} />
                   </>
                )}
                <FileNode name="App.js" type="file" depth={1} />
                <FileNode name="index.css" type="file" depth={1} />
             </>
           )}

           <FileNode name="package.json" type="file" />
           <FileNode name="README.md" type="file" />
       </div>
    </div>
  );
};

export default FileExplorer;