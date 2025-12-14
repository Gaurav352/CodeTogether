// src/pages/LoginPage.jsx
import React from 'react';
import { Mail, Lock, ArrowRight, Code2 } from 'lucide-react';
// import { Link } from 'react-router-dom'; // Uncomment if needed

const LoginPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-white overflow-hidden">
      
      {/* --- CSS FOR FLOATING ANIMATION --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); } /* Moves up */
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite; /* 5s duration = slow */
        }
      `}</style>

      {/* --- LEFT SIDE: FORM SECTION --- */}
      <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 lg:px-20 z-10">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 text-primary">
            <div className="p-2 bg-surface rounded-lg border border-muted/20">
              <Code2 size={28} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">CodeSync</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back.
          </h2>
          <p className="mt-2 text-sm text-muted">
            Enter your details to access your workspace.
          </p>

          {/* Form */}
          <form className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full rounded-xl bg-surface border border-muted/20 pl-10 pr-3 py-3 text-white placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="name@work.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                 <label className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
                 <a href="#" className="text-xs font-semibold text-primary hover:text-blue-400 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full rounded-xl bg-surface border border-muted/20 pl-10 pr-3 py-3 text-white placeholder-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all mt-6">
              Sign In
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            No account?{' '}
            {/* Link logic commented out as per your snippet */}
            <span className="font-semibold text-white hover:text-secondary transition-colors border-b border-transparent hover:border-secondary cursor-pointer">
               Create one
            </span>
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: THE FLOATING "BOX" --- */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-6 lg:p-12 relative">
        
        {/* ADDED CLASS: 'animate-float' 
            This applies the CSS keyframes defined at the top 
        */}
        <div className="animate-float relative w-full max-w-lg aspect-[3/4] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border border-muted/20">
            
            {/* The Image */}
            <img
              src="image.png"
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90"></div>

            {/* Content Inside Box */}
            <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="h-1 w-12 bg-secondary rounded-full mb-4"></div>
                <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                  Collaborate in <br />
                  <span className="text-secondary">Real-Time.</span>
                </h3>
                <p className="text-sm text-muted/80 leading-relaxed">
                  The fastest way to build software together, from anywhere in the world.
                </p>
            </div>
        </div>

        {/* Decorative elements behind the box */}
        {/* I added a pulse animation to the background glow too for extra effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      
      </div>

    </div>
  );
};

export default LoginPage;