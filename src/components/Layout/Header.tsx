import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="title-animation"
            >
              <Link to="/" className="text-xl font-bold text-white">
                Keuangan Telaga Pakisaji
              </Link>
            </motion.div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-accent transition-colors">
              Beranda
            </Link>
            <Link to="/transaksi" className="text-white hover:text-accent transition-colors">
              Transaksi
            </Link>
            <Link to="/laporan" className="text-white hover:text-accent transition-colors">
              Laporan
            </Link>
            <Link to="/akun" className="text-white hover:text-accent transition-colors">
              Akun
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-primary-dark"
        >
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link 
              to="/" 
              className="block text-white hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/transaksi" 
              className="block text-white hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Transaksi
            </Link>
            <Link 
              to="/laporan" 
              className="block text-white hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Laporan
            </Link>
            <Link 
              to="/akun" 
              className="block text-white hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Akun
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;