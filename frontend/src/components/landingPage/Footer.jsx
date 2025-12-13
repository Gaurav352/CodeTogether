// Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface py-12 border-t border-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               {/* Small Logo Icon */}
              <img 
            src="image.png" 
            alt="CollabSync Logo" 
            className="h-8 w-auto object-contain" 
          />
              <span className="text-lg font-bold text-white">CodeSync</span>
            </div>
            <p className="text-muted text-sm mb-6">
              Making real-time collaboration seamless for developers around the world.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
           <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-muted/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted">
          <p>© 2023 CodeSync. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
              {/* Social placeholders */}
              <a href="#" className="hover:text-white"><span className="sr-only">Twitter</span>TW</a>
              <a href="#" className="hover:text-white"><span className="sr-only">GitHub</span>GH</a>
          </div>
        </div>
      </div>
    </footer>
  );
}