import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileExplorer from './FileExplorer';
import EditorHeader from './EditorHeader';
import MonacoWindow from './MonacoWindow';
import useEditorStore from '../../zustand/useEditorStore';
export default function CodeEditor({ roomId }) {
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [theme, setTheme] = useState('vs-dark'); 
  const [language, setLanguage] = useState('javascript');

  const { activeFile, isTreeLoading, fetchFileTree, hasFetchedFiles } = useEditorStore();

  useEffect(() => {
    if (roomId && !hasFetchedFiles) {
      fetchFileTree(roomId);
    }
  }, [roomId, hasFetchedFiles, fetchFileTree]);

  return (
    <div className="flex h-full w-full bg-navy text-ghost-white overflow-hidden rounded-2xl border border-brand-purple/20 shadow-2xl shadow-navy/80 relative">
      
      {/* Mobile Overlay for Explorer */}
      <AnimatePresence>
        {isExplorerOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute md:relative z-20 h-full"
          >
            {isTreeLoading ? (
              <div className="w-64 h-full bg-navy/80 flex justify-center items-center font-mono text-brand-pink animate-pulse">
                 Loading Tree...
              </div>
            ) : (
              <FileExplorer onClose={() => setIsExplorerOpen(false)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D0E26]"> 
        <EditorHeader 
          theme={theme} setTheme={setTheme}
          language={language} setLanguage={setLanguage}
          activeFile={activeFile?.name || "No file selected"} // Safely display the file name
          toggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
          isExplorerOpen={isExplorerOpen}
        />
        
        <div className="flex-1 p-2 relative">
          {activeFile ? (
             <MonacoWindow 
               theme={theme} 
               language={activeFile.language || language} 
             />
          ) : (
            <div className="h-full flex items-center justify-center font-mono text-ghost-white/40">
              Select a file from the explorer to start coding.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}