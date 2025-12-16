import React from 'react';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]">
      
      <div className="relative flex flex-col items-center">
        
        {/* --- ORBIT SPINNER --- */}
        <div className="relative w-16 h-16">
            
            {/* Outer Ring (Slow Spin) - Primary Blue */}
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite]"></div>
            
            {/* Middle Ring (Medium Spin) - Secondary Green */}
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-secondary border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
            
            {/* Inner Dot (Pulse) */}
            <div className="absolute inset-[1.4rem] bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
        </div>

        {/* --- SIMPLE TEXT --- */}
        <div className="mt-8 flex flex-col items-center gap-1">
            <span className="text-white font-medium tracking-widest text-sm uppercase">Loading</span>
            <div className="h-0.5 w-12 bg-muted/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary/80 animate-progress w-full origin-left"></div>
            </div>
        </div>

      </div>

      {/* --- CSS FOR CUSTOM ANIMATIONS --- */}
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default GlobalLoader;