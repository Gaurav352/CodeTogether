import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useEditorStore from '../../zustand/useEditorStore';

export default function CreateNodeDialog({ isOpen, type, parentId, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    // Call the parent function which handles the store logic
    const success = await onSubmit(name, type, parentId);
    
    if (success) {
      setName('');
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-[#15173D] border border-brand-purple/40 rounded-xl shadow-2xl p-5 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-ghost-white font-medium text-sm">
                Create New {type === 'file' ? 'File' : 'Folder'}
              </h3>
              <X 
                size={16} 
                className="text-ghost-white/50 hover:text-brand-pink cursor-pointer transition-colors" 
                onClick={onClose}
              />
            </div>

            <form onSubmit={handleSubmit}>
              <input 
                autoFocus
                type="text"
                placeholder={type === 'file' ? 'e.g. index.js' : 'e.g. components'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#0D0E26] border border-brand-purple/30 text-ghost-white text-sm rounded-lg px-3 py-2 outline-none focus:border-brand-pink transition-colors mb-4 placeholder:text-ghost-white/30 disabled:opacity-50"
              />
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-medium text-ghost-white/70 hover:text-ghost-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="px-4 py-1.5 text-xs font-medium bg-brand-purple/20 text-brand-pink border border-brand-purple/50 rounded-lg hover:bg-brand-purple/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}