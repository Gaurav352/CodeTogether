import React from 'react';
import { Code2, Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F172A] text-white">
      
      <div className="relative flex items-center justify-center mb-8">
        
        <div className="absolute h-24 w-24 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        
        <div className="relative z-10 p-4 bg-surface/50 rounded-2xl border border-white/5 backdrop-blur-sm shadow-2xl">
           <Code2 size={48} className="text-primary" strokeWidth={2} />
        </div>
        
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        CodeSync
      </h2>
      
      <div className="flex items-center gap-3 text-muted/60 text-sm font-medium tracking-wide">
         <span>Initializing Workspace</span>
         
         <span className="flex gap-1">
            <span className="h-1 w-1 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-1 w-1 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-1 w-1 bg-secondary rounded-full animate-bounce"></span>
         </span>
      </div>

      <div className="absolute bottom-12">
        <Loader2 size={24} className="text-muted/20 animate-spin" />
      </div>

    </div>
  );
};

export default LoadingScreen;