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

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('editor');
  const { authUser } = useAuthStore();
  const { roomId } = useParams();
  const { socket, connect, disconnect } = useSocketStore();
  const {initChatListeners, cleanupChatListeners} = useChatStore();
  const {initEditorListeners, cleanupEditorListeners} = useEditorStore();
  const { initWorkspaceListeners, cleanupWorkspaceListeners, setRoomId } = useWorkspaceStore();

  useEffect(() => {
    if (authUser && roomId) {
      setRoomId(roomId);
      connect(authUser._id, authUser.fullName); 
    }
    return () => {
      disconnect();
    };
  }, [authUser, roomId, connect, disconnect])
  useEffect(() => {
    if (socket && roomId) {
      initWorkspaceListeners(roomId);
      initEditorListeners();
      initChatListeners();

    }
    return () => {
      cleanupWorkspaceListeners();
      cleanupEditorListeners();
      cleanupChatListeners();
    };
  }, [socket, roomId, initWorkspaceListeners, cleanupWorkspaceListeners,initEditorListeners]);
  const handleLeaveRoom = () => {
    navigate('/dashboard'); 
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'editor':
        return <CodeEditor roomId={roomId} />;
      case 'whiteboard':
        return <div className="text-ghost-white p-8">Whiteboard Component goes here...</div>;
      case 'chat':
        return <LiveChatPanel/>
      case 'info':
        return <div className="text-ghost-white p-8">Room Info Component goes here...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-navy overflow-hidden">
      {/* Sidebar Navigation */}
      <WorkspaceSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLeave />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* <WorkspaceHeader /> */}

        {/* Dynamic View Rendering with Framer Motion */}
        <div className="flex-1 overflow-y-auto bg-navy/90 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
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