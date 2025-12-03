import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white py-16 px-6 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <a href="/" className="mb-4 transition-transform hover:scale-105">
              <img 
                src="/images/logo.png" 
                alt="CulinaShare Logo" 
                className="h-16 w-auto"
              />
            </a>
            <p className="text-emerald-100 mt-3 text-center md:text-left max-w-xs">
              Connecting food lovers around the world through authentic recipes and culinary experiences.
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-6 relative">
              <span className="relative z-10">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-300 rounded-full z-0"></span>
            </h3>
            <div className="space-y-4 text-emerald-50 text-center md:text-left">
              <a href="mailto:info@culinashare.com" className="flex items-center justify-center md:justify-start group hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                cookscorner@gmail.com
              </a>
              <p className="flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mon-Fri: 9AM - 5PM EST
              </p>
            </div>
            <div className="mt-6">
              <a href="/contact" className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-medium text-sm">
                <span>Contact Support</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Social Media Links */}
          {/* <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-bold mb-6 relative">
              <span className="relative z-10">Connect With Us</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-300 rounded-full z-0"></span>
            </h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm rounded-full p-3 transition hover:bg-white/20 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm rounded-full p-3 transition hover:bg-white/20 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm rounded-full p-3 transition hover:bg-white/20 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
            <div className="mt-8 space-y-2 text-center md:text-left">
              <h4 className="font-medium text-emerald-200">Subscribe to our newsletter</h4>
              <div className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg bg-white/10 backdrop-blur-sm border border-emerald-400/30 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
                />
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium px-4 py-2 rounded-r-lg transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div> */}
        </div>
        
        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-emerald-400/30 text-center">
          <p className="text-emerald-100">© {new Date().getFullYear()} Cook's Corner. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center space-x-6">
            <a href="/privacy" className="text-emerald-200 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-emerald-200 hover:text-white transition-colors">Terms of Service</a>
            <a href="/faq" className="text-emerald-200 hover:text-white transition-colors">FAQ</a>
            <a href="/sitemap" className="text-emerald-200 hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;