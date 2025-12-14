import { ChevronDown, ChevronRight, FileCode, Folder } from "lucide-react";
import React from "react";
const FileNode = ({ name, type, depth = 0, isOpen, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-[#334155]/50 cursor-pointer text-sm text-muted hover:text-white transition-colors select-none" 
      style={{ paddingLeft: `${depth * 12 + 12}px` }}
    >
        {/* Arrow for Folders */}
        <span className="w-4 flex justify-center shrink-0">
            {type === 'folder' && (
                isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
        </span>

        {/* Icons */}
        {type === 'folder' ? (
             <Folder size={15} className="text-primary/80 shrink-0" />
        ) : (
             <FileCode size={15} className="text-secondary/80 shrink-0" />
        )}
        
        {/* Name */}
        <span className="truncate">{name}</span>
    </div>
  )
}
export default FileNode;