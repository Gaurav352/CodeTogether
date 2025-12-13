// Header.jsx
import React, { useState } from 'react';

export default function Header() {
  // State to handle mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Logo Section */}
        <a href="/" className="flex items-center gap-2">
          {/* Added 'h-8 w-auto' to ensure the logo fits the header height */}
          <img 
            src="image.png" 
            alt="CollabSync Logo" 
            className="h-8 w-auto object-contain" 
          />
          <span className="text-xl font-bold tracking-tight text-white">
            CodeSync
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How It Works</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-medium text-muted hover:text-white transition-colors">
            Log in
          </button>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button 
          className="md:hidden p-2 text-muted hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            // Close Icon (X)
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-muted/20 bg-background px-4 py-6 space-y-4 shadow-xl">
           <nav className="flex flex-col space-y-4">
             <a 
               href="#features" 
               className="text-base font-medium text-muted hover:text-white"
               onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
             >
               Features
             </a>
             <a 
               href="#how-it-works" 
               className="text-base font-medium text-muted hover:text-white"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               How It Works
             </a>
             <a 
               href="#pricing" 
               className="text-base font-medium text-muted hover:text-white"
               onClick={() => setIsMobileMenuOpen(false)}
             >
               Pricing
             </a>
           </nav>
           
           <div className="pt-4 flex flex-col gap-3 border-t border-muted/20 mt-4">
             <button className="w-full text-left text-base font-medium text-muted hover:text-white">
               Log in
             </button>
             <button className="w-full rounded-md bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-blue-600">
               Get Started
             </button>
           </div>
        </div>
      )}
    </header>
  );
}