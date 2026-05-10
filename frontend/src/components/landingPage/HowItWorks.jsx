import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Initialize Workspace", desc: "Spin up a dedicated container environment in one click." },
    { num: "02", title: "Invite the Squad", desc: "Share your secure URL. Teammates join instantly in their browser." },
    { num: "03", title: "Ship Code", desc: "Write, review, and execute together seamlessly." }
  ];

  return (
    <section id="working" className="bg-navy py-32 px-6 md:px-12 text-ghost-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        <h2 className="text-4xl md:text-6xl font-extrabold mb-20 text-center tracking-tight">
          How it <span className="text-brand-pink italic font-serif">works.</span>
        </h2>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-start gap-8 group"
            >
              {/* Modern Neon Number Indicator */}
              <div className="flex flex-col items-center">
                <div className="text-brand-purple font-mono font-bold text-xl bg-white/5 w-14 h-14 rounded-full flex items-center justify-center border border-brand-purple/30 group-hover:border-brand-pink group-hover:shadow-[0_0_15px_#E491C9] transition-all">
                  {step.num}
                </div>
                {idx !== steps.length - 1 && (
                  <div className="w-[1px] h-20 bg-gradient-to-b from-brand-purple/50 to-transparent mt-4"></div>
                )}
              </div>
              
              <div className="pt-3">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-brand-pink transition-colors">{step.title}</h3>
                <p className="text-ghost-white/60 text-lg">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}