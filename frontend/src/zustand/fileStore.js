import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { buildFileTree } from "../utils/buildFileTree.js";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useFileStore = create(persist((set, get) => ({
    fileTree: null,
    selectedFile: null,
    selectedFolder: null,
    activeAction: false,
    expandedFolders: {},
    selectFile: (fileNode=null) => set({ selectedFile: fileNode }),
    toggleFolder: (folderId) => set((state) => ({
        expandedFolders: {
            ...state.expandedFolders,
            [folderId]: !state.expandedFolders[folderId] // Flip the value
        },

    })),
    fetchProjectTree: async (roomId) => {

        try {
            const res = await axiosInstance.post(`/folder/getFileTree/${roomId}`);
            if (res.data.success) {
                const treeStructure = buildFileTree(res.data.folders, res.data.files);
                set({ fileTree: treeStructure });
                return true;
            }
        } catch (error) {
            console.log("error in fetching filetree");
            return false;
        }
    },
    createFolder: async (data) => {

        try {
            const res = await axiosInstance.post("/folder/create", data);
            if (res.data.success) {
                console.log("folder created successfully");
                set({ selectedFolder: true });
                set((state) => ({
                    expandedFolders: {
                        ...state.expandedFolders,
                        [data.parent]: true
                    }
                }));
                return true;
            }
        } catch (error) {
            console.log("error in folder creation");
            return false;
        }
    },
    createFile: async (data) => {

        try {
            const res = await axiosInstance.post("/folder/createFile", data);
            if (res.data.success) {
                console.log("file created successfully");
                set({ selectedFile: res.data.file._id });
                return true;
            }
        } catch (error) {
            console.log("failed to create file");
            return false;
        }
    },
    openCreateModal: (node, type) => {
        set({ selectedFolder: node.id, activeAction: type })
    },
    closeCreateModal: () => {
        set({ activeAction: null })
    },
    fetchFileContent:async(fileId)=>{
        try {
            
            const res = await axiosInstance.post(`/folder/fetchFileContent/${fileId}`);
            if(res.data.success){
                return res.data.file;
            }
        } catch (error) {
            console.log("error in fetching file ",error.response.data.message);
            return false;
        }
    },
    saveCode:async(fileId,content)=>{
        try {
            const res=await axiosInstance.post(`/folder/save/${fileId}`,{content});
            if(res.data.success){
                return true;
            }
        } catch (error) {
            console.log("error in saving code ");
            return false;
        }
    }
}), {
    name: 'file-explorer-state',
    partialize: (state) => ({
        expandedFolders: state.expandedFolders,
        selectedFile: state.selectedFile
    }),
}

));
export default useFileStore;