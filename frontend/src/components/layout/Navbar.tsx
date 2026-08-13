// ============================================================================
// NAVBAR COMPONENT
// ============================================================================
// Premium AI Commerce Platform - Light Theme

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Login' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 py-4 border-b ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-2xl border-[#E8E4DD]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto px-8 lg:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-purple-300 to-purple-400 rounded-2xl blur-xl opacity-40"
              />
              <span className="relative z-10 text-xl text-white font-light tracking-wider">VS</span>
            </motion.div>
            <div>
              <motion.span
                className="text-xl font-light text-[#2D2A26] block tracking-wide"
              >
                VendSway
              </motion.span>
              <div className="text-[10px] text-[#8B7AB8] font-medium -mt-0.5 tracking-[0.25em] uppercase">
                VendSway
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ y: -2 }}
                onClick={() => navigate(item.path)}
                className={`text-sm font-light transition-all duration-500 relative group tracking-wide ${
                  location.pathname === item.path
                    ? 'text-[#8B7AB8]'
                    : 'text-[#6B6660] hover:text-[#2D2A26]'
                }`}
              >
                {item.label}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: location.pathname === item.path ? '100%' : 0 }}
                  className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                />
              </motion.button>
            ))}
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="group relative px-8 py-3 bg-[#8B7AB8] hover:bg-[#7A69A7] text-white font-light rounded-full transition-all duration-500 shadow-lg overflow-hidden tracking-wide"
          >
            <div className="relative z-10 flex items-center gap-2">
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;