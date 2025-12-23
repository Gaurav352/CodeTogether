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
import useFileStore from '../../../zustand/fileStore';
import CreateDialogBox from './CreateDialogBox';


const FileExplorer = ({ isOpen }) => {
  // Mock State for folder toggling
  const [folders, setFolders] = useState({ src: true, components: false });
  const {fileTree,selectedFile,activeAction,selectedFolder}=useFileStore();
  console.log(fileTree);

  const closeCreateModal=()=>{}
  const handleDialogSubmit=()=>{}
  const toggleFolder = (name) => {
    setFolders(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!isOpen) return null;
  if (!fileTree || !fileTree.items) return <div className="p-4 text-xs text-gray-500">No files/folders</div>;

  return (
    <div className="w-60 h-full bg-[#0F172A] border-r border-muted/20 flex flex-col shrink-0 transition-all duration-300">
       
       {/* Explorer Header */}
       <div className="h-12 flex items-center justify-between px-4 border-b border-muted/20">
           <span className="text-xs font-bold text-muted uppercase tracking-wider">Explorer</span>
           <div className="flex gap-2 text-muted">
               <button className="hover:text-white"><Plus size={16} /></button>
               
           </div>
       </div>

       {fileTree.items.map((node) => (
           <FileNode 
             key={node.id}   
             node={node}        
             depth={0}         
           />
         ))}
         <CreateDialogBox 
         isOpen={!!activeAction} // Open if action is not null
         type={activeAction}
       />
    </div>
  );
};

export default FileExplorer;