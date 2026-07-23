import { create } from "zustand";
import axiosInstance from "../lib/axios";
import buildFileTree from "../lib/buildFileTree";
import useSocketStore from "./useSocketStore";
import toast from "react-hot-toast";
import getFileLanguage from "../lib/detectLanguage";
const useEditorStore = create((set, get) => ({
    fileTree: [],
    activeFile: null,
    isTreeLoading: false,
    hasFetchedFiles: false,
    fetchFileTree: async (roomId) => {
        if (get().hasFetchedFiles) return;
        try {
            set({ isTreeLoading: true });
            const res = await axiosInstance.get(`/folder/getFileTree/${roomId}`);
            if (res.data.success) {
                const nestedTree = buildFileTree(res.data.folders, res.data.files);
                set({ fileTree: nestedTree });
            }
        } catch (error) {
            console.log("Error in fetching file tree ", error);
            toast.error(error.response?.data?.message || "Failed to create file");
        } finally {
            set({ isTreeLoading: false });
        }
    },
    setActiveFile: (fileNode) => {
        set({ activeFile: fileNode });
    },
    toggleFolder: (folderId) => {
        set((state) => {
            const toggleNode = (nodes) => nodes.map(node => {
                if (node._id === folderId) {
                    return { ...node, isOpen: !node.isOpen };
                }
                if (node.children) {
                    return { ...node, children: toggleNode(node.children) };
                }
                return node;
            });
            return { fileTree: toggleNode(state.fileTree) };
        });
    },
    addNodeToTree: (newNode, parentId) => {
        set((state) => {
            // If parentId is null, it belongs at the root of the workspace
            if (!parentId) {
                return { fileTree: [...state.fileTree, newNode] };
            }

            const insertNode = (nodes) => {
                return nodes.map(node => {
                    if (node._id === parentId) {
                        return {
                            ...node,
                            isOpen: true,
                            children: [...(node.children || []), newNode]
                        };
                    } else if (node.children) {
                        // Keep searching deeper
                        return { ...node, children: insertNode(node.children) };
                    }
                    return node;
                });
            };

            return { fileTree: insertNode(state.fileTree) };
        });
    },
    removeNodeFromTree: (nodeId) => {
        set((state) => {
            // 1. The Recursive Filter
            const filterNodes = (nodes) => {
                return nodes
                    // Step A: Filter out the node if it exists at the current level
                    .filter(node => node._id !== nodeId)
                    // Step B: If it's a folder, recursively run this inside its children
                    .map(node => {
                        if (node.children) {
                            return { ...node, children: filterNodes(node.children) };
                        }
                        return node;
                    });
            };

            
            const newActiveFile = state.activeFile?._id === nodeId ? null : state.activeFile;

            return { 
                fileTree: filterNodes(state.fileTree),
                activeFile: newActiveFile
            };
        });
    },
    createFile: async (roomId, name, folder) => {
        try {
            const language = getFileLanguage(name);
            const payload = { roomId, name, language, folder };
            const res = await axiosInstance.post('/folder/createFile', payload);
            if (res.data.success) {
                const newNode = { ...res.data.file, type: 'file' };
                get().addNodeToTree(newNode, folder);
                set({ activeFile: newNode });
                toast.success(res.data.message);
                return true;
            }
        } catch (error) {
            console.error("Failed to create file:", error);
            toast.error(error.response?.data?.message || "Failed to create file");
            return false;
        }
    },
    createFolder: async (roomId, name, parentId) => {
        try {

            const payload = { roomId, name, parent: parentId };
            const endpoint = '/folder/create';
            const res = await axiosInstance.post(endpoint, payload);

            if (res.data.success) {
                const newNode = { ...res.data.folder, type: 'folder' };
                get().addNodeToTree(newNode, parentId);
                toast.success(res.data.message);
                return true;
            }
        } catch (error) {
            console.error("Failed to create node:", error);
            toast.error(error.response?.data?.message || "Failed to create folder");
            return false;
        }
    },
    deleteNode: async (roomId, nodeId, nodeType) => {
        try {
            const endpoint = nodeType === 'file' ? '/folder/deleteFile' : '/folder/deleteFolder';
            const res = await axiosInstance.delete(endpoint, {
                data: {
                    roomId: roomId,
                    [nodeType === 'file' ? 'fileId' : 'folderId']: nodeId
                }
            });
            if (res.data.success) {
            get().removeNodeFromTree(nodeId);
            
            toast.success(res.data.message || `${nodeType} deleted successfully`);
            return true;
        }
        } catch (error) {
            console.error(`Failed to delete ${nodeType}:`, error);
            toast.error(error.response?.data?.message || `Failed to delete ${nodeType}`);
            return false;
        }
    }
}));
export default useEditorStore;