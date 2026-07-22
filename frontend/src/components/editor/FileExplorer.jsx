import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Folder, FolderOpen, FileCode, Trash2, Edit2, FilePlus, FolderPlus, X } from 'lucide-react';
import useEditorStore from '../../zustand/useEditorStore';
import CreateNodeDialog from './CreateNodeDialog';

export default function FileExplorer({ onClose }) {
  const { roomId } = useParams(); // Grab roomId from the URL
  const { fileTree, activeFile, setActiveFile, toggleFolder, createNode } = useEditorStore();
  
  // Dialog State
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false, type: null, parentId: null });

  const openCreateDialog = (e, type, parentId = null) => {
    if (e) e.stopPropagation(); 
    setDialogConfig({ isOpen: true, type, parentId });
  };

  // This bridges the Dialog component to the Zustand Store
  const handleCreateSubmit = async (name, type, parentId) => {
    // createNode returns true if API succeeds, false if it fails
    return await createNode(roomId, name, type, parentId);
  };

  const renderTree = (nodes) => {
    return nodes.map(node => (
      <div key={node._id} className="pl-4 w-full">
        <div 
          onClick={() => {
            if (node.type === 'file') setActiveFile(node);
            if (node.type === 'folder') toggleFolder(node._id);
          }}
          className={`group flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all ${
            activeFile?._id === node._id ? 'bg-brand-purple/20 text-brand-pink' : 'hover:bg-white/5 text-ghost-white/80 hover:text-ghost-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {node.type === 'folder' ? (
               node.isOpen ? <FolderOpen size={16} className="text-brand-purple" /> : <Folder size={16} className="text-brand-purple" />
            ) : (
               <FileCode size={16} />
            )}
            <span className="text-sm font-medium tracking-wide">{node.name}</span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.type === 'folder' && (
              <>
                <FilePlus size={14} className="hover:text-brand-pink transition-colors" onClick={(e) => openCreateDialog(e, 'file', node._id)} />
                <FolderPlus size={14} className="hover:text-brand-purple transition-colors" onClick={(e) => openCreateDialog(e, 'folder', node._id)} />
              </>
            )}
            <Edit2 size={14} className="hover:text-brand-purple transition-colors" onClick={(e) => e.stopPropagation()} />
            <Trash2 size={14} className="hover:text-red-400 transition-colors" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
        
        {node.type === 'folder' && node.isOpen && node.children && (
          <div className="border-l border-brand-purple/20 ml-2 mt-1">
            {renderTree(node.children)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      <div className="w-64 h-full bg-navy/80 backdrop-blur-xl border-r border-brand-purple/30 flex flex-col shadow-2xl relative">
        <div className="flex items-center justify-between p-4 border-b border-brand-purple/20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-pink">Explorer</span>
          <div className="flex items-center gap-3">
            <FilePlus size={16} className="cursor-pointer hover:text-brand-pink transition-colors" onClick={(e) => openCreateDialog(e, 'file', null)} />
            <FolderPlus size={16} className="cursor-pointer hover:text-brand-purple transition-colors" onClick={(e) => openCreateDialog(e, 'folder', null)} />
            <X size={18} className="cursor-pointer md:hidden hover:text-brand-pink" onClick={onClose} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-brand-purple/30">
          {fileTree.length === 0 ? (
            <div className="text-xs text-ghost-white/40 text-center mt-10 font-mono">Workspace is empty.</div>
          ) : (
            renderTree(fileTree)
          )}
        </div>
      </div>

      {/* Render the clean dialog component here! */}
      <CreateNodeDialog 
        isOpen={dialogConfig.isOpen}
        type={dialogConfig.type}
        parentId={dialogConfig.parentId}
        onClose={() => setDialogConfig({ isOpen: false, type: null, parentId: null })}
        onSubmit={handleCreateSubmit}
      />
    </>
  );
}