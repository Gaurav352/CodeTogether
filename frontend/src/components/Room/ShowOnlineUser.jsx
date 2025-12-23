import React, { useState } from "react";
import useAuthStore from "../../zustand/authStore";// Adjust path
import useSocketStore from "../../zustand/socketStore";     // Adjust path
import { Users, X } from "lucide-react";

const ShowOnlineUsers = () => {
  const { onlineUsers } = useSocketStore();
  const { authUser } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to get initials
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // The actual list content (reused for both mobile and desktop)
  const UserListContent = () => (
    <div className="flex flex-col h-full">
      <h3 className="font-bold text-lg mb-4 text-purple-400 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Online ({onlineUsers.length})
      </h3>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {onlineUsers.length === 0 && (
          <p className="text-gray-500 text-sm italic">No one else is here...</p>
        )}

        {onlineUsers.map((user) => {
           const isMe = user.userId === authUser?._id;
           
           return (
            <div
              key={user.userId}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isMe ? "bg-purple-900/30 border border-purple-500/30" : "bg-gray-800/50 hover:bg-gray-700/50"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {getInitials(user.fullname)}
                </div>
                {/* Green Dot */}
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
              </div>

              {/* Info */}
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-gray-100 truncate w-32">
                  {user.fullname || "Anonymous"}
                </span>
                {isMe && (
                  <span className="text-[10px] text-purple-300 font-semibold tracking-wider">
                    YOU
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* =========================================
          DESKTOP VIEW (Hidden on mobile)
      ========================================= */}
      <div className="hidden md:flex w-64 flex-col bg-gray-900 border-l border-gray-800 p-4 h-full">
        <UserListContent />
      </div>

      {/* =========================================
          MOBILE VIEW (Floating Button + Drawer)
      ========================================= */}
      <div className="md:hidden">
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-transform active:scale-95"
        >
          <Users className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gray-900">
            {onlineUsers.length}
          </span>
        </button>

        {/* Backdrop (Click to close) */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Slide-over Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-gray-900 border-l border-gray-700 z-50 p-5 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Render List */}
          <div className="mt-8 h-full">
             <UserListContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowOnlineUsers;