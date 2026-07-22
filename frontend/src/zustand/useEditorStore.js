import { create } from "zustand";
import axiosInstance from "../lib/axios";
import buildFileTree from "../lib/buildFileTree";
import useSocketStore from "./useSocketStore";
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

            // Otherwise, recursively find the parent folder and push the new child
            const insertNode = (nodes) => {
                return nodes.map(node => {
                    if (node._id === parentId) {
                        // Found the parent! Add the new node and force the folder open
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
    createNode: async (roomId, name, type, parentId) => {
        try {
            const {socket} = useSocketStore();
            const payload = { roomId, name, type, parentId };
            const res = await axiosInstance.post(`/folder/create`, payload);

            if (res.data.success) {
                const newNode = res.data.node; 

                get().addNodeToTree(newNode, parentId);

                if (type === 'file') {
                    set({ activeFile: newNode });
                }
                if (socket) {
                    socket.emit('FILE_CREATED', { roomId, newNode, parentId });
                }

                return true; 
            }
        } catch (error) {
            console.error("Failed to create node:", error);
            return false; 
        }
    }
}))
export default useEditorStore;