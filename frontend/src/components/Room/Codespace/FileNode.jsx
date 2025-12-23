import React, { useState, useEffect, useRef } from "react";
import {
    ChevronDown,
    ChevronRight,
    FileCode,
    Folder,
    MoreVertical,
    FilePlus,
    FolderPlus,
    Trash2
} from "lucide-react";
import useFileStore from "../../../zustand/fileStore";

const FileNode = ({
    node,
    depth = 0,
    onDelete,
    onCreateFile,
    onCreateFolder
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { openCreateModal, toggleFolder, expandedFolders, selectFile ,selectedFile} = useFileStore();
    const isOpen = expandedFolders[node.id] || false;
    //console.log(node);

    const handleToggle = (e) => {
        e.stopPropagation();
        if (node.isFolder) {
            toggleFolder(node.id);
        } else {
            selectFile(node);
        }
    };

    // --- MENU LOGIC ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleAction = (e, action) => {
        e.stopPropagation();
        setShowMenu(false);

        if (action === 'file') openCreateModal(node, 'FILE');
        if (action === 'folder') openCreateModal(node, 'FOLDER');
        //if (action === 'delete') deleteNode(node.id);
    };

    return (
        <div className="select-none">
            {/* 1. THE ROW */}
            <div
                onClick={handleToggle}
                className={`group relative flex items-center gap-1.5 py-1.5 px-2 cursor-pointer transition-colors
    ${
                    // 👇 Highlight ONLY if it matches the currently open file
                    selectedFile?.id === node.id
                        ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500"  // Active 
                        : "text-muted hover:bg-[#334155]/50 hover:text-white border-l-2 border-transparent" // Inactive
                    }`}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
                {/* Arrow (Only for folders) */}
                <span className="w-4 flex justify-center shrink-0">
                    {node.isFolder && (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    )}
                </span>

                {/* Icon */}
                {node.isFolder ? (
                    <Folder size={15} className="text-blue-500 shrink-0" />
                ) : (
                    <FileCode size={15} className="text-yellow-500 shrink-0" />
                )}

                {/* Name */}
                <span className="truncate">{node.name}</span>

                {/* --- THREE DOT MENU (For BOTH Files and Folders) --- */}
                <div className="ml-auto relative flex items-center" ref={menuRef}>

                    {/* Trigger Button */}
                    <button
                        onClick={handleMenuClick}
                        className={`p-1 rounded-md hover:bg-slate-700 hover:text-white transition-opacity ${showMenu ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-muted'}`}
                    >
                        <MoreVertical size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-6 w-36 bg-[#1e293b] border border-slate-700 rounded-md shadow-xl z-50 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">

                            {/* Options ONLY for Folders */}
                            {node.isFolder && (
                                <>
                                    <button
                                        onClick={(e) => handleAction(e, 'file')}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-blue-600 hover:text-white text-left transition-colors"
                                    >
                                        <FilePlus size={14} />
                                        <span>New File</span>
                                    </button>
                                    <button
                                        onClick={(e) => handleAction(e, 'folder')}
                                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-blue-600 hover:text-white text-left transition-colors"
                                    >
                                        <FolderPlus size={14} />
                                        <span>New Folder</span>
                                    </button>
                                    <div className="h-px bg-slate-700 my-1" /> {/* Divider */}
                                </>
                            )}

                            {/* Delete Option (For Both) */}
                            <button
                                onClick={(e) => handleAction(e, 'delete')}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors"
                            >
                                <Trash2 size={14} />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. THE RECURSIVE CHILDREN */}
            {node.isFolder && isOpen && node.items && (
                <div className="flex flex-col">
                    {node.items.map((childNode) => (
                        <FileNode
                            key={childNode.id}
                            node={childNode}
                            depth={depth + 1}
                            onDelete={onDelete}
                            onCreateFile={onCreateFile}
                            onCreateFolder={onCreateFolder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileNode;