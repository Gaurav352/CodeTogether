// src/components/CodeEditorMockup.jsx
import React, { useState, useEffect } from 'react';

export default function CodeEditorMockup() {
  // Configuration for the typing animation
  const phrases = [
    "data.user.id);",
    "data.payload.results[0]);",
    "formatDate(new Date()));"
  ];
  const TYPING_SPEED = 150; // ms per character
  const DELETING_SPEED = 75;  // ms per character (faster than typing)
  const PAUSE_BEFORE_DELETE = 2000; // Wait 2s after typing finishes
  const PAUSE_BEFORE_NEXT = 500; // Wait 0.5s before starting next phrase

  // State to manage the animation
  const [textIndex, setTextIndex] = useState(0); // Which phrase are we on?
  const [displayedText, setDisplayedText] = useState(""); // What text is currently showing on screen
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingDelay, setTypingDelay] = useState(TYPING_SPEED);

  useEffect(() => {
    const currentPhrase = phrases[textIndex % phrases.length];

    const handleTyping = () => {
      setDisplayedText((prev) => {
        if (isDeleting) {
          // DELETING LOGIC
          if (prev === "") {
             // Finished deleting current phrase
            setIsDeleting(false);
            setTextIndex((prevIndex) => prevIndex + 1); // Move to next phrase
            setTypingDelay(PAUSE_BEFORE_NEXT); // Pause before starting to type again
            return "";
          }
          // Continue deleting
          setTypingDelay(DELETING_SPEED);
          return prev.slice(0, -1);
        } else {
          // TYPING LOGIC
          if (prev === currentPhrase) {
            // Finished typing current phrase
            setIsDeleting(true);
            setTypingDelay(PAUSE_BEFORE_DELETE); // Pause before starting delete
            return prev;
          }
          // Continue typing next character
          setTypingDelay(TYPING_SPEED + (Math.random() * 50)); // Add slight human randomness
          return currentPhrase.slice(0, prev.length + 1);
        }
      });
    };

    // Run the function after the calculated delay
    const timer = setTimeout(handleTyping, typingDelay);

    // Cleanup timer on re-render
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, textIndex, typingDelay, phrases]);


  return (
    <div className="w-full max-w-lg mx-auto transform transition-all hover:scale-[1.01] duration-500">
      
      {/* Window Frame */}
      <div className="rounded-xl bg-[#1e293b] border border-muted/30 shadow-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Window Header */}
        <div className="bg-surface/50 px-4 py-3 border-b border-muted/20 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-xs text-muted font-mono opacity-70">
            socket_controller.js
          </div>
        </div>

        {/* Code Area */}
        <div className="p-6 bg-background/80 font-mono text-sm overflow-hidden relative min-h-[320px]">
          
          <div className="space-y-1">
            <Line num={1} content={<>import <span className="text-primary">io</span> from <span className="text-secondary">'socket.io-client'</span>;</>} />
            <Line num={2} content={<>&nbsp;</>} />
            <Line num={3} content={<><span className="text-muted">// Initialize connection</span></>} />
            <Line num={4} content={<><span className="text-primary">const</span> socket = io(<span className="text-secondary">'/api/realtime'</span>);</>} />
            <Line num={5} content={<>&nbsp;</>} />
            <Line num={6} content={<>socket.on(<span className="text-secondary">'data_stream'</span>, (data) ={'>'} {'{'}</>} />
            
            {/* --- LINE 7: THE ANIMATED LINE --- */}
            <div className="flex relative items-center">
                <span className="w-8 text-muted/30 select-none text-right pr-3">7</span>
                
                {/* We use whitespace-pre so spaces are respected */}
                <div className="text-white whitespace-pre flex items-center">
                  {/* Static start of the line */}
                  <span>  console.log(</span>
                  
                  {/* The Dynamic Text drawn from state */}
                  <span className="text-secondary">{displayedText}</span>
                  
                  {/* The Cursor Container (Inline so it follows text) */}
                  <span className="relative inline-flex overflow-visible">
                      
                      {/* 1. The Blinking Cursor Bar */}
                      {/* Use border-r instead of bg color for a sharper cursor look */}
                      <span className="h-5 border-r-2 border-secondary animate-pulse ml-0.5"></span>

                      {/* 2. The Name Tag (Floating above) */}
                      <span className="absolute -top-2 left-0 bg-secondary text-[#45b623] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1 z-10">
                        {/* Little pinging dot */}
                        
                        Doe typing..
                      </span>

                  </span>
                </div>
            </div>
            {/* --------------------------------- */}

            <Line num={8} content={<>{'}'};</>} />
            <Line num={9} content={<>&nbsp;</>} />
            <Line num={10} content={<><span className="text-muted">// Waiting for input...</span></>} />
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper sub-component for static lines
const Line = ({ num, content }) => (
  <div className="flex items-center">
    <span className="w-8 text-muted/30 select-none text-right pr-3">{num}</span>
    <span className="text-white whitespace-pre">{content}</span>
  </div>
);