// Features.jsx
import React from 'react';

// Feature data defined outside component for cleanliness
const featuresList = [
  {
    title: "Real-time Coding",
    description: "Simultaneous editing with zero latency. See cursors move and code appear as your team types.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Live Whiteboard",
    description: "Brainstorm architecture and draw diagrams together on an infinite canvas. Instant synchronization.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.077-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.04 2.886c.556-.38 1.19-.573 1.86-.573a3 3 0 011.526.422m0 0a15.998 15.998 0 003.388-1.62m-5.04 2.886A4.486 4.486 0 0012 21.75c.932 0 1.8-.26 2.556-.72m0 0l4.215-6.312a2.534 2.534 0 00.598-2.203 6.01 6.01 0 00-6.887-3.672l-1.04.19c-1.196.22-2.37.523-3.506.92L3.877 8.747c-.538.273-.896.8-.992 1.408-.108.68.186 1.371.74 1.757l2.853 1.988z" />
      </svg>
    ),
  },
  {
    title: "Real-time Chat & Voice",
    description: "Discuss context without leaving the editor. Integrated text chat and quick voice channels.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-7.332.61c-.506.042-1.012.062-1.518.062H9c-1.19 0-2.286-.346-3.235-.948l-3.788 2.525c-.64.427-1.495.1-1.495-.667V5.53c0-1.21.81-2.243 1.98-2.34l8.41-1.03c.498-.06 1.006-.09 1.515-.09h.06c1.19 0 2.285.346 3.234.948l2.771-1.848c.64-.426 1.495-.099 1.495.668v1.473c0 1.136-.848 2.1-1.98 2.193l-3.973.331z" />
      </svg>
    ),
  },
  {
    title: "Instant Invites",
    description: "Create a project and invite collaborators via a simple URL. No complex onboarding required.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-24 relative overflow-hidden">
        {/* Decorative blob */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to <span className="text-secondary">collaborate remotely.</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Powerful tools integrated into a single platform, specifically designed for synchronized teamwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuresList.map((feature, index) => (
            // The Card Component
            <div key={index} className="relative p-6 rounded-2xl bg-surface border border-muted/20 shadow-lg hover:border-secondary/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}