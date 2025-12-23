import React, { useState } from 'react';
import { X, FilePlus, FolderPlus } from 'lucide-react';
import useFileStore from '../../../zustand/fileStore';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getLangageFromExtension } from '../../../utils/languageMapping.js';

const CreateDialogBox = () => {
    const { closeCreateModal, activeAction: type, createFile, createFolder, selectedFolder,fetchProjectTree } = useFileStore();
    const [name, setName] = useState('');
    const { roomId } = useParams();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !roomId) {
            toast.error("Something is missing");
            closeCreateModal();
            return;
        }
        if (type === 'FOLDER') {
            const data = {
                parent: selectedFolder,
                roomId,
                name
            }
            try {
                const res=await createFolder(data);
                if(res){
                    toast.success("Folder created");
                    await fetchProjectTree(roomId);
                }else{
                    toast.error("Failed to create folder");
                    setName('');
                }
            } catch (error) {
                toast.error("Failed to create folder");
            } finally {
                setLoading(false);
                closeCreateModal();
            }
        } else if(type === 'FILE'){
            const language=getLangageFromExtension(name);
            const data={
                name,
                language,
                folder:selectedFolder || null,
                roomId
            }
            try {
                const res=await createFile(data);
                if(res){
                    toast.success("File created");
                    await fetchProjectTree(roomId);
                    setName('');
                }else{
                    toast.error("Failed to create file");
                }
            } catch (error) {
                toast.error("Failed to create file");
            } finally {
                setLoading(false);
                closeCreateModal();
            }
        }
        
    }


    if (!type) return null;

    return (
        // 1. Backdrop (Overlay)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">

            {/* 2. Modal Card */}
            <div className="w-96 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-white font-semibold">
                        {/* Dynamic Icon based on type */}
                        {type === 'FOLDER' ? (
                            <FolderPlus size={18} className="text-blue-400" />
                        ) : (
                            <FilePlus size={18} className="text-yellow-400" />
                        )}
                        <span>Create New {type === 'folder' ? 'Folder' : 'File'}</span>
                    </div>

                    <button
                        onClick={closeCreateModal}
                        className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
                        {type === 'FOLDER' ? 'Folder Name' : 'File Name'}
                    </label>

                    <input
                        type="text"
                        autoFocus
                        value={name}
                        disabled={loading}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={type === 'FOLDER' ? "e.g., components" : "e.g., App.js"}
                        className="w-full bg-[#0F172A] text-white border border-slate-600 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                    />

                    <p className="mt-2 text-[10px] text-slate-500">
                        Press <kbd className="bg-slate-700 px-1 rounded text-slate-300 font-sans">Enter</kbd> to create
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-700/50 bg-slate-800/30 rounded-b-xl">
                    <button
                        disabled={loading}
                        onClick={closeCreateModal}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all active:scale-95
    ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20 text-white"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Creating...
                            </div>
                        ) : (
                            "Create"
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default CreateDialogBox;
