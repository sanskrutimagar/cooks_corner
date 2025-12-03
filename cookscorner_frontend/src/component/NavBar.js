import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogOut = () => {
    localStorage.removeItem('culinashareToken');
    navigate('/');
    setIsProfileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-emerald-700 text-white' : '';
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <svg 
                className="h-8 w-8 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-white font-bold text-xl tracking-wider">Cook's Corner</span>
            </Link>
            
            {/* Desktop navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Favorites', path: '/favorites' },
                  { name: 'Add Recipe', path: '/addRecipe' },
                  { name: 'About', path: '/about' },
                  { name: 'AI Help', path: '/chatbot' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-emerald-800 transition duration-150 ease-in-out ${isActive(item.path)}`}
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop account section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {localStorage.getItem('culinashareToken') ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-white hover:bg-emerald-800 p-2 rounded-full focus:outline-none transition duration-150 ease-in-out"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        onClick={handleLinkClick}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="text-white bg-emerald-800 hover:bg-emerald-900 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    onClick={handleLinkClick}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-emerald-800 bg-white hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    onClick={handleLinkClick}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-emerald-800 focus:outline-none transition duration-150 ease-in-out"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {[
            { name: 'Home', path: '/' },
            { name: 'Favorites', path: '/favorites' },
            { name: 'Add Recipe', path: '/addRecipe' },
            { name: 'About', path: '/about' },
            { name: 'AI Help', path: '/chatbot' }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800 transition duration-150 ease-in-out ${isActive(item.path)}`}
              onClick={handleLinkClick}
            >
              {item.name}
            </Link>
          ))}
          
          {localStorage.getItem('culinashareToken') ? (
            <div className="pt-4 pb-3 border-t border-emerald-800">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">Your Account</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800 transition duration-150 ease-in-out"
                  onClick={handleLinkClick}
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800 transition duration-150 ease-in-out"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-emerald-800">
              <Link
                to="/login"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-emerald-800 transition duration-150 ease-in-out"
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="mt-2 block px-3 py-2 rounded-md text-base font-medium bg-white text-emerald-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                onClick={handleLinkClick}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;