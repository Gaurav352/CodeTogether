import React from 'react';
import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section id="features" className="bg-ghost-white py-32 px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold text-navy tracking-tight mb-6">
            A workspace built <br/><span className="text-brand-purple">for velocity.</span>
          </h2>
        </div>

        {/* Bento Box Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]"
        >
          {/* Card 1: Spans 2 columns */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-navy/5 shadow-xl shadow-navy/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl group-hover:bg-brand-pink/20 transition-colors"></div>
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-2xl font-bold text-navy mb-3">Multiplayer Coding</h3>
            <p className="text-navy/70 max-w-md">Zero-latency keystrokes. See exactly what your teammates are typing in real-time, with shared contexts and custom cursors.</p>
          </div>

          {/* Card 2: Spans 1 column */}
          <div className="col-span-1 bg-navy rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-purple rounded-full blur-2xl opacity-50"></div>
            <div className="text-4xl mb-4 relative z-10">⚡</div>
            <h3 className="text-2xl font-bold text-ghost-white mb-3 relative z-10">Instant Execute</h3>
            <p className="text-ghost-white/70 relative z-10">Run code directly in the browser cloud. No local setup required.</p>
          </div>

          {/* Card 3: Spans 1 column */}
          <div className="col-span-1 bg-brand-purple text-ghost-white rounded-3xl p-8 shadow-xl">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-3">Multiple project support</h3>
            <p className="text-ghost-white/80">Work on multiple projects parallely with complete isolated environments.</p>
          </div>

          {/* Card 4: Spans 2 columns */}
          <div className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden group">
             <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform origin-left">🎨</div>
            <h3 className="text-2xl font-bold text-navy mb-3">Live Architecture Whiteboard</h3>
            <p className="text-navy/70 max-w-md">Draw system designs right next to your code. Nodes connect, sync, and export flawlessly to your team's wiki.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}