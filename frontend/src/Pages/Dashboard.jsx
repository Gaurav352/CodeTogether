import React, { useEffect, useState } from "react";
import { Plus, LayoutDashboard, ArrowLeft, ShieldAlert } from "lucide-react"; // Added ArrowLeft, ShieldAlert
import RoomCard from "../components/Room/RoomCard";
import CreateRoomDialog from "../components/Room/CreateRoomDialog";
import useRoomStore from "../zustand/roomStore";
import GlobalLoader from "../components/GlobalLoader";
import { Link, useNavigate } from "react-router-dom"; 
import JoinRoomDialog from "../components/Room/JoinRoomDialog";

export default function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const { fetchAllRooms, allRooms } = useRoomStore();
  const [isSplashLoading, setSplashLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const loadRooms = async () => {
      const minDelay = new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      await Promise.all([
        fetchAllRooms(),
        minDelay,
      ]);
      setSplashLoading(false);
    };

    loadRooms();
  }, []);

  if (isSplashLoading) return <GlobalLoader />;

  return (
    <div className="min-h-screen w-full bg-[#0F172A] p-6 md:p-10 text-white font-sans">

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

        {/* 1. Title Section */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-surface/50 rounded-xl border border-white/5">
            <LayoutDashboard size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted text-sm">Manage your collaborative spaces</p>
          </div>
        </div>

        {/* 2. Actions Group (Right Aligned) */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

          {/* A. Go Back Button */}
          <button
            onClick={() => navigate('/')} // Or navigate(-1) to go back in history
            className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold transition-all text-slate-300 hover:text-white border border-transparent hover:border-slate-600"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          {/* B. Verify Account (Conditional) */}
          {/* Check 'isAccountVerified' - verify this matches your DB field name */}
          
              <button
              onClick={() => setJoinModalOpen(true)}
                className="flex-1 md:flex-none group flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
              >
                <Plus size={18} />
                <span>Join Room</span>
              </button>
            

          {/* C. Create New Room (Primary Action) */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 md:flex-none group flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-blue-600 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
            <span>New Room</span>
          </button>

        </div>
      </div>

      {/* --- ROOMS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRooms?.map((room) => (
          <RoomCard
            key={room._id}
            roomName={room.name}
            createdAt={room.createdAt}
            inviteLink={room.inviteLink}
            roomId={room._id}
          />
        ))}
      </div>

      {isCreateModalOpen && (
        <CreateRoomDialog onClose={() => setCreateModalOpen(false)} />
      )}
      {isJoinModalOpen && (
        <JoinRoomDialog onClose={() => setJoinModalOpen(false)} />
     )}
    </div>
  );
}