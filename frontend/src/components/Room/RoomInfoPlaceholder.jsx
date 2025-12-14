import { Info } from "lucide-react";
import React from "react";
const RoomInfoPlaceholder = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="bg-surface p-8 rounded-2xl border border-muted/20 shadow-xl">
       <div className="flex items-center gap-4 mb-6">
         <div className="p-3 bg-primary/20 rounded-lg">
           <Info size={24} className="text-primary" />
         </div>
         <h3 className="text-xl font-bold text-white">Room Details</h3>
       </div>
       
       <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-muted/10 pb-3">
            <span className="text-muted text-sm">Room Name</span>
            <span className="text-white font-medium">TheAntelope12 Project</span>
          </div>
          <div className="flex justify-between items-center border-b border-muted/10 pb-3">
             <span className="text-muted text-sm">Room ID</span>
             <code className="text-secondary bg-background border border-muted/30 px-3 py-1 rounded text-sm font-mono tracking-wider">
               8XJ-992-KL
             </code>
          </div>
          <div className="flex justify-between items-center border-b border-muted/10 pb-3">
             <span className="text-muted text-sm">Owner</span>
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500"></div>
                <span className="text-white">Gaurav</span>
             </div>
          </div>
       </div>
    </div>
  </div>
);
export default RoomInfoPlaceholder;