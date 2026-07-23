import React, { useState } from 'react';
import useEditorStore from '../../zustand/useEditorStore';
import useWorkspaceStore from '../../zustand/useWorkspaceStore';

export default function DeleteNodeDialog({ isOpen, node, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteNode } = useEditorStore();
  const { roomId } = useWorkspaceStore();

  if (!isOpen || !node) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    
    const success = await deleteNode(roomId, node._id, node.type);
    if(success){
        onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-navy border border-brand-purple/30 rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold text-ghost-white mb-2">
          Delete {node.type === 'file' ? 'File' : 'Folder'}
        </h3>
        
        <p className="text-sm text-ghost-white/70 mb-6">
          Are you sure you want to delete <span className="font-mono text-brand-pink font-bold">"{node.name}"</span>? 
          {node.type === 'folder' && " This will also delete all files inside it."}
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-ghost-white/80 hover:text-ghost-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}