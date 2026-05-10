import React from 'react';
import Navbar from '../components/landingPage/Navbar';
import Features from '../components/landingPage/Features';
import Footer from '../components/landingPage/Footer';
import Hero from '../components/landingPage/Hero';
import HowItWorks from '../components/landingPage/HowItWorks';


export default function App() {
  return (
    <div className="min-h-screen bg-ghost-white font-sans overflow-x-hidden selection:bg-brand-pink selection:text-navy">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks/>
      </main>
      <Footer />
    </div>
  );
}