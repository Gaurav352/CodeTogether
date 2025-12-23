import React, { useEffect, useState } from 'react';
import {
    Code2,
    PenTool,
    Info,
    LogOut,
    ChartAreaIcon,
    ActivityIcon
} from 'lucide-react';
import ChatPage from '../components/Room/ChatPage';
import RoomInfoPlaceholder from '../components/Room/RoomInfoPlaceholder';
import WhiteboardPlaceholder from '../components/Room/WhiteboardPlaceholder';
import CodeSpacePlaceholder from '../components/Room/Codespace/CodeSpacePlaceholder';
import SidebarItem from '../components/Room/SidebarItem';
import { useParams } from 'react-router-dom';
import useRoomStore from '../zustand/roomStore';
import LoadingScreen from '../components/LoadingScreen';
import useFileStore from '../zustand/fileStore';
import useSocketStore from '../zustand/socketStore';
import useAuthStore from '../zustand/authStore';
import ShowOnlineUsers from '../components/Room/ShowOnlineUser';
import ACTIONS from '../../../backend/src/socket/socketEvents';
import toast from 'react-hot-toast';

export default function RoomPage() {
    const [activeTab, setActiveTab] = useState('codespace');
    const { roomId } = useParams();
    const [loading, setIsLoading] = useState(false);
    const fetchCurrentRoom = useRoomStore((state) => state.fetchCurrentRoom);
    const { fetchProjectTree, selectFile } = useFileStore();
    const { disconnectSocket,connectAndJoin } = useSocketStore();
    const { authUser } = useAuthStore();



    // 3. INITIALIZATION LOGIC (API calls)
    useEffect(() => {
        const initRoom = async () => {
            setIsLoading(true);
            const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));
            try {
                await Promise.allSettled([
                    fetchCurrentRoom(roomId, authUser),
                    fetchProjectTree(roomId),
                    selectFile(null),
                    minDelay
                ]);
                toast.success("Workspace initialisation done");
            } catch (error) {
                toast.error("Invalid Room code or access denied");
            } finally {
                setIsLoading(false);
            }

        }
        initRoom();

    }, [roomId, fetchCurrentRoom, fetchProjectTree]);

    
    if (loading) return <LoadingScreen />

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-white font-sans">

            {/* --- SIDEBAR (Fixed Small Width) --- */}
            <aside className="flex flex-col w-20 bg-surface border-r border-muted/20 z-20 items-center py-4">

                {/* 1. Logo (Static) */}
                <div className="h-12 w-12 mb-6 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">
                    <Code2 size={24} strokeWidth={2.5} />
                </div>

                {/* 2. Navigation Items */}
                <nav className="flex-1 w-full flex flex-col gap-4 px-3 overflow-hidden items-center">

                    <SidebarItem
                        Icon={Code2}
                        label="Code Space"
                        expanded={false}
                        isActive={activeTab === 'codespace'}
                        onClick={() => setActiveTab('codespace')}
                    />

                    <SidebarItem
                        Icon={PenTool}
                        label="Whiteboard"
                        expanded={false}
                        isActive={activeTab === 'whiteboard'}
                        onClick={() => setActiveTab('whiteboard')}
                    />

                    <SidebarItem
                        Icon={Info}
                        label="Room Info"
                        expanded={false}
                        isActive={activeTab === 'info'}
                        onClick={() => setActiveTab('info')}
                    />
                    <SidebarItem
                        Icon={ChartAreaIcon}
                        label="Room Chat"
                        expanded={false}
                        isActive={activeTab === 'chat'}
                        onClick={() => setActiveTab('chat')}
                    />
                    <SidebarItem
                        Icon={ActivityIcon}
                        label="Online Users"
                        expanded={false}
                        isActive={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />

                </nav>

                {/* 3. Footer / Exit */}
                <div className="mt-auto pt-4 border-t border-muted/20 w-full flex justify-center">
                    <button
                        className="h-12 w-12 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent transition-all group"
                        title="Leave Room"
                    >
                        <LogOut size={22} className="group-hover:text-red-400" />
                    </button>
                </div>

            </aside>


            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-background">

                {/* Content Body */}
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    {activeTab === 'codespace' && <CodeSpacePlaceholder />}
                    {activeTab === 'whiteboard' && <WhiteboardPlaceholder />}
                    {activeTab === 'info' && <RoomInfoPlaceholder />}
                    {activeTab === 'chat' && <ChatPage />}
                    {activeTab === 'users' && <ShowOnlineUsers />}
                </div>

            </main>
        </div>
    );
}