import { create } from "zustand";
import axiosInstance from "../lib/axios";
import buildFileTree, { sortFileTree } from "../lib/buildFileTree";
import useSocketStore from "./useSocketStore";
import toast from "react-hot-toast";
import getFileLanguage from "../lib/detectLanguage";
import ACTIONS from "../../../socketEvents.js";

const useEditorStore = create((set, get) => ({
    fileTree: [],
    fileCache: {},
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
                const sortedTree = sortFileTree(nestedTree);
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
    fetchFileContent: async () => {
        const { fileCache, activeFile } = get();
        if (!activeFile || !activeFile._id) return;
        const fileId = activeFile._id;
        if (fileCache[fileId]) {
            set((state) => ({
                activeFile: {
                    ...state.activeFile,
                    content: fileCache[fileId]
                }
            }));
            return;
        }
        try {
            const res = await axiosInstance.get(`/folder/getFileContent/${get().activeFile._id}`);
            if (res.data.success) {
                const fileData = res.data.file;
                set((state)=>({
                    activeFile: fileData,
                    fileCache:{
                        ...state.fileCache,
                        fileId:fileData.content
                    }
                }));
            }
        } catch (error) {
            console.log("Error in fetching file content ", error);
            toast.error(error.response?.data?.message || "Failed to fetch file content");
        }
    },
    updateFileContent:(fileId,newContent,roomId,skipEmit=false)=>{
        set((state)=>({
            activeFile:state.activeFile?._id===fileId?{...state.activeFile,content:newContent}:state.activeFile,
            fileCache:{
                ...state.fileCache,
                [fileId]:newContent
            }
        }));
        const socket = useSocketStore.getState().socket;
        if(!skipEmit && socket && roomId){
            socket.emit(ACTIONS.FILE_UPDATED,{fileId,content:newContent,roomId});
        }
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
                const exists = state.fileTree.some(node => node._id === newNode._id);
                if (exists) return state;
                return { fileTree: sortFileTree([...state.fileTree, newNode]) };
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
            const updatedTree = insertNode(state.fileTree);
            return { fileTree: sortFileTree(updatedTree) };
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
                toast.success(res.data.message || `${nodeType} deleted successfully`);
                return true;
            }
        } catch (error) {
            console.error(`Failed to delete ${nodeType}:`, error);
            toast.error(error.response?.data?.message || `Failed to delete ${nodeType}`);
            return false;
        }
    },
    initEditorListeners: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;
        socket.off(ACTIONS.RECEIVE_FILE_CREATED);
        socket.off(ACTIONS.RECEIVE_FOLDER_CREATED);
        socket.off(ACTIONS.RECEIVE_NODE_DELETED);
        socket.off(ACTIONS.RECEIVE_FILE_UPDATED);
        socket.on(ACTIONS.RECEIVE_FILE_CREATED, ({ newNode, parentId }) => {
            const nodeWithType = { ...newNode, type: 'file' };
            get().addNodeToTree(nodeWithType, parentId);
        });

        socket.on(ACTIONS.RECEIVE_FOLDER_CREATED, ({ newNode, parentId }) => {
            const nodeWithType = { ...newNode, type: 'folder', isOpen: false };
            get().addNodeToTree(nodeWithType, parentId);
        });
        socket.on(ACTIONS.RECEIVE_NODE_DELETED, ({ nodeId }) => {
            get().removeNodeFromTree(nodeId);
        })
        socket.on(ACTIONS.RECEIVE_FILE_UPDATED, ({ fileId, content }) => {
            get().updateFileContent(fileId, content,null,true);
        });
    },
    cleanupEditorListeners: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;
        socket.off(ACTIONS.RECEIVE_FILE_CREATED);
        socket.off(ACTIONS.RECEIVE_FOLDER_CREATED);
        socket.off(ACTIONS.RECEIVE_NODE_DELETED);
        socket.off(ACTIONS.RECEIVE_FILE_UPDATED);
    },
}));
export default useEditorStore;