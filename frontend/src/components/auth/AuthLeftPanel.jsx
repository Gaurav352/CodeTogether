import React from 'react';

export default function AuthLeftPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#121433] to-[#1b1e4f]">
      {/* Decorative glowing orb inside the left panel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-purple/30 rounded-full blur-[80px]"></div>
      
      {/* Logo */}
      <div className="relative z-10 text-2xl font-extrabold tracking-wider text-brand-pink cursor-default">
        Code<span className="text-ghost-white">Sync</span>
      </div>

      {/* Hero Text */}
      <div className="relative z-10 mt-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight text-ghost-white">
          Build the future, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">together.</span>
        </h1>
        <p className="text-ghost-white/60 text-lg max-w-sm">
          Join thousands of developers coding, chatting, and deploying in real-time.
        </p>
      </div>

      {/* Code Graphic */}
      <div className="relative z-10 mt-12 opacity-50 font-mono text-sm text-brand-pink bg-black/20 p-4 rounded-xl border border-white/5">
        <p>{`const workspace = new CodeSync();`}</p>
        <p>{`workspace.invite(team);`}</p>
        <p>{`workspace.launch(); // 🚀`}</p>
      </div>
    </div>
  );
}