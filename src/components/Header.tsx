import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';

export default function Header({ style, className = "text-white" }: { style?: React.CSSProperties, className?: string }) {
  const { logo } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference ${className}`} style={style}>
        <Link to="/" className="flex items-center relative z-50" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>
          {logo ? <img src={logo} alt="drawee" className="h-6 md:h-8 w-auto object-contain brightness-0 invert" /> : <span className="text-2xl font-semibold tracking-tighter">drawee</span>}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="/#work" className="hover:opacity-60 transition-opacity">Work</a>
          <Link to="/about" className="hover:opacity-60 transition-opacity">About</Link>
          <Link to="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden relative z-50 p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg text-text flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8 text-2xl font-medium">
              <a href="/#work" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Work</a>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">About</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Contact</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
