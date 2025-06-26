import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;