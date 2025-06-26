import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, HomeIcon, CurrencyDollarIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Beranda', path: '/', icon: <HomeIcon className="h-5 w-5" /> },
    { name: 'Transaksi', path: '/transaksi', icon: <CurrencyDollarIcon className="h-5 w-5" /> },
    { name: 'Laporan', path: '/laporan', icon: <ChartBarIcon className="h-5 w-5" /> },
    { name: 'Akun', path: '/akun', icon: <UserGroupIcon className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white text-primary-700 shadow-md' : 'bg-primary-600 text-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Telaga Pakisaji</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors ${isActive(link.path) 
                  ? (scrolled ? 'bg-primary-100 text-primary-700' : 'bg-primary-700 text-white') 
                  : (scrolled ? 'hover:bg-gray-100' : 'hover:bg-primary-700')}`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className={`px-4 py-3 ${scrolled ? 'bg-white' : 'bg-primary-700'}`}>
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${isActive(link.path) 
                      ? (scrolled ? 'bg-primary-100 text-primary-700' : 'bg-primary-800 text-white') 
                      : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-primary-800')}`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;