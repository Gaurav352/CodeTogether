import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../zustand/authStore';
import { Link } from 'react-router-dom';

export default function Hero() {
  const codeSnippet = `function initWorkspace() {\n  const session = createCollab();\n  session.connect({\n    video: true,\n    cursor: 'smooth'\n  });\n  console.log('We are live! 🚀');\n}`;
  const [typedCode, setTypedCode] = useState('');
  const {authUser}=useAuthStore();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedCode(codeSnippet.slice(0, index));
      index++;
      if (index > codeSnippet.length + 20) index = 0; 
    }, 60); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-navy py-32 px-6 md:px-12 flex items-center justify-center min-h-screen overflow-hidden">
      
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-purple rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-pink rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-ghost-white leading-[1.1]">
            Code Together. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">
              Ship Faster.
            </span>
          </h1>
          <p className="text-lg text-ghost-white/70 max-w-xl mx-auto lg:mx-0 font-light">
            Drop the screen sharing. Build alongside your team with zero-latency multiplayer coding, integrated whiteboards, and live execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <Link to={authUser ? "/dashboard":"/authPage"}>
              <button className="w-full sm:w-auto bg-brand-pink text-navy px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(228,145,201,0.3)]">
                Start Building Free
              </button>
            </Link>
            
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <div className="bg-[#0f112e]/80 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative transform perspective-1000 rotate-y-[-5deg] rotate-x-[5deg]">
            
            <div className="bg-white/5 px-4 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="bg-black/20 px-3 py-1 rounded-md text-ghost-white/50 text-xs font-mono">workspace/main.js</div>
              <div className="w-4"></div> 
            </div>

            <div className="p-8 font-mono text-sm md:text-base h-[320px] relative text-ghost-white/90">
              <div className="whitespace-pre-wrap relative">
                <span className="text-brand-pink">import</span> {'{ createCollab }'} <span className="text-brand-pink">from</span> 'codesync';<br/><br/>
                {typedCode}
                
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-[2px] h-5 bg-brand-pink align-middle ml-[2px] relative shadow-[0_0_8px_#E491C9]"
                >
                  <span className="absolute -top-6 left-0 bg-brand-pink text-navy text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">You</span>
                </motion.span>
              </div>

              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-[120px] left-[200px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                   <path d="M5.65376 21.3462L3.21092 3.86432C3.06173 2.79679 4.20321 1.93827 5.16108 2.39958L21.0505 10.0531C22.0463 10.5325 22.0121 11.9682 20.9902 12.404L13.8213 15.4611C13.5606 15.5723 13.3444 15.7628 13.2087 16.0093L10.0906 21.6775C9.57147 22.6214 8.16335 22.5699 7.72856 21.5901L5.65376 21.3462Z" fill="#982598" stroke="white" strokeWidth="1.5"/>
                </svg>
                <span className="absolute top-5 left-3 bg-brand-purple text-ghost-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Alex</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}