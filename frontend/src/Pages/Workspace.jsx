import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar';
import CodeEditor from '../components/editor/CodeEditor';
import useSocketStore from '../zustand/useSocketStore';
import useWorkspaceStore from '../zustand/useWorkspaceStore';
import useAuthStore from '../zustand/authStore';
import { useParams } from 'react-router-dom';
import useEditorStore from '../zustand/useEditorStore';
import LiveChatPanel from '../components/chat/LiveChatPanel';
import useChatStore from '../zustand/useChatStore';
import ACTIONS from "../../../socketEvents.js";
import RoomInfo from '../components/workspace/RoomInfo.jsx';
import { useSearchParams } from 'react-router-dom';

export default function Workspace() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'editor'
  const { authUser } = useAuthStore();
  const { roomId } = useParams();
  const { socket, connect, disconnect } = useSocketStore();
  const { initChatListeners, cleanupChatListeners } = useChatStore();
  const { initEditorListeners, cleanupEditorListeners, resetEditorState } = useEditorStore();
  const { initWorkspaceListeners, cleanupWorkspaceListeners, setRoomId, fetchCurrentRoom } = useWorkspaceStore();

  useEffect(() => {
    if (authUser && roomId) {
      setRoomId(roomId);
      connect(authUser._id, authUser.fullName);
      const res = fetchCurrentRoom(roomId);
    }
    return () => {
      disconnect();
    };
  }, [authUser, roomId, connect, disconnect])
  useEffect(() => {
    if (!socket || !roomId) return;

    initWorkspaceListeners(roomId);
    initEditorListeners();
    initChatListeners();

    const handleServerReconnect = () => {
      socket.emit(ACTIONS.JOIN_ROOM, { roomId });
    };
    socket.on("connect", handleServerReconnect);
    return () => {
      socket.off("connect", handleServerReconnect);
      cleanupWorkspaceListeners();
      cleanupEditorListeners();
      cleanupChatListeners();
      resetEditorState();
    };
  }, [socket, roomId, initWorkspaceListeners, cleanupWorkspaceListeners, initEditorListeners, resetEditorState]);
  const handleLeaveRoom = () => {
    navigate('/dashboard');
  };

  const renderActiveView = () => {
    return (
        <div className="flex-1 h-full w-full relative overflow-hidden bg-navy">

            {/* 1. Code Editor Tab */}
            <div className={`absolute inset-0 h-full w-full transition-all duration-300 ease-out transform ${
                activeTab === 'editor' ? 'opacity-100 scale-100 z-10 visible' : 'opacity-0 scale-95 z-0 invisible pointer-events-none'
            }`}>
                <CodeEditor roomId={roomId} />
            </div>

            {/* 2. Whiteboard Tab */}
            <div className={`absolute inset-0 h-full w-full transition-all duration-300 ease-out transform ${
                activeTab === 'whiteboard' ? 'opacity-100 scale-100 z-10 visible' : 'opacity-0 scale-95 z-0 invisible pointer-events-none'
            }`}>
                <div className="text-ghost-white p-8">
                    Whiteboard Component goes here...
                </div>
            </div>

            {/* 3. Live Chat Tab */}
            <div className={`absolute inset-0 h-full w-full overflow-hidden relative transition-all duration-300 ease-out transform ${
                activeTab === 'chat' ? 'opacity-100 scale-100 z-10 visible' : 'opacity-0 scale-95 z-0 invisible pointer-events-none'
            }`}>
                <LiveChatPanel activeTab={activeTab} />
            </div>

            {/* 4. Room Info Tab (Fixed with absolute positioning and transition classes) */}
            <div className={`absolute inset-0 h-full w-full overflow-y-auto transition-all duration-300 ease-out transform ${
                activeTab === 'info' ? 'opacity-100 scale-100 z-10 visible' : 'opacity-0 scale-95 z-0 invisible pointer-events-none'
            }`}>
                <RoomInfo />
            </div>

        </div>
    );
};

  return (
    <div className="flex h-screen w-full bg-navy overflow-hidden">
      {/* Sidebar Navigation */}
      <WorkspaceSidebar activeTab={activeTab} onLeave />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* <WorkspaceHeader /> */}

        {/* Dynamic View Rendering with Framer Motion */}
        <div className="flex-1 overflow-y-auto bg-navy/90 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}