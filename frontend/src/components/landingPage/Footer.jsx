import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-brand-purple py-10 px-6 text-ghost-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold tracking-wider text-brand-pink">
          Code<span className="text-ghost-white">Sync</span>
        </div>
        
        <div className="flex space-x-6 text-sm opacity-80">
          <a href="#" className="hover:text-brand-pink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Contact</a>
        </div>

        <div className="text-sm opacity-60">
          © {new Date().getFullYear()} CodeSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
}