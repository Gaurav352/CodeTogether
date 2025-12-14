import { PenTool } from "lucide-react";
import React from "react";

const WhiteboardPlaceholder = () => (
  <div className="h-full w-full rounded-2xl bg-white flex flex-col items-center justify-center text-slate-400 group">
    <div className="p-6 bg-slate-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
      <PenTool size={48} className="text-slate-500" />
    </div>
    <h3 className="text-xl font-semibold text-slate-800">Whiteboard Canvas</h3>
    <p className="text-sm mt-2">Canvas implementation goes here.</p>
  </div>
);
export default  WhiteboardPlaceholder;