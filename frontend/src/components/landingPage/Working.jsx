// HowItWorks.jsx
import React from 'react';

export default function Working() {
  return (
    <section id="how-it-works" className="bg-background py-24 border-t border-muted/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From idea to deployment in minutes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-muted/20 w-3/4 mx-auto -z-10"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface border-4 border-primary flex items-center justify-center text-3xl font-bold text-white mb-6 z-10">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Create a Project</h3>
            <p className="text-muted max-w-sm">
              Spin up a new environment instantly. Choose your stack and starter template.
            </p>
          </div>

           {/* Step 2 */}
           <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface border-4 border-secondary flex items-center justify-center text-3xl font-bold text-white mb-6 z-10">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Share the URL</h3>
            <p className="text-muted max-w-sm">
              Copy the invite link. Send it to your team on Slack, Teams, or Email.
            </p>
          </div>

           {/* Step 3 */}
           <div className="relative flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface border-4 border-primary flex items-center justify-center text-3xl font-bold text-white mb-6 z-10">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start Collaborating</h3>
            <p className="text-muted max-w-sm">
              Jump into the code, draw on the whiteboard, and chat instantly.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}