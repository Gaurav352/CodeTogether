// Hero.jsx
import React from 'react';
import CodeEditorMockup from './CodeEditorMockup';
import useAuthStore from '../../zustand/authStore';
import { Link } from 'react-router-dom';

export default function Hero() {
  const {authUser} = useAuthStore();
  return (
    <section className="bg-background py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Build faster, together. <br className="hidden lg:inline" />
              <span className="text-primary">Real-time collaboration</span> for engineering teams.
            </h1>
            <p className="mx-auto lg:mx-0 max-w-2xl text-lg text-muted sm:text-xl leading-relaxed">
              Stop sharing screens and start sharing context. Code, design, and chat in one unified workspace designed for speed and synchronicity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to={authUser ? "/dashboard" : "/login"}>
                <button className="rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                  Start Building for Free
                </button>
              </Link>
              <button className="rounded-lg border border-muted/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-surface/50 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Hero Image/Placeholder */}
          <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              {/* Abstract background blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -z-10"></div>
              
              {/* Mockup Window */}
              <div className="relative w-full perspective-1000">
             {/* We simply drop the component here */}
             <CodeEditorMockup />
             
             {/* Optional: Add a subtle glow behind it */}
             <div className="absolute inset-0 bg-secondary/5 blur-3xl -z-10"></div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}