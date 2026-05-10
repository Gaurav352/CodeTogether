export default function CollabWindow() {
  return (
    <div className="px-4 md:px-0">
      <div className="max-w-4xl mx-auto mt-8 md:mt-16 p-2 md:p-4 bg-purple/10 border border-purple/20 rounded-3xl relative overflow-hidden group">
        {/* Window Controls */}
        <div className="bg-[#050510] rounded-2xl p-4 md:p-8 font-mono text-xs md:text-base min-h-[250px] md:min-h-[350px] shadow-2xl">
          <div className="flex gap-1.5 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
          </div>
          
          <code className="text-ghost/90 block leading-relaxed">
            <span className="text-purple">const</span> <span className="text-pink">Project</span> = () =&gt; {"{"} <br/>
            &nbsp;&nbsp;<span className="text-ghost/50">// Real-time engine active</span> <br/>
            &nbsp;&nbsp;<span className="text-purple">return</span> <span className="text-pink">"Success"</span>; <br/>
            {"}"}
          </code>
        </div>

        {/* Cursors - Scaled down for mobile */}
        <div className="absolute top-1/4 left-1/4 animate-pulse pointer-events-none">
          <div className="flex flex-col items-start scale-75 md:scale-100">
            <div className="w-4 h-4 bg-pink rounded-full animate-ping absolute"></div>
            <span className="bg-pink text-navy text-[10px] px-2 py-0.5 rounded-full font-bold mt-4 shadow-lg">Ishika</span>
          </div>
        </div>
      </div>
    </div>
  );
}