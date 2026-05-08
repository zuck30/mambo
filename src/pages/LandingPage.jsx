import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Apple, PlayCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url("https://w.wallhaven.cc/full/72/wallhaven-72pmyo.jpg")',
        }}
      />
      
      {/* Background Gradient / Image Placeholder */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff79ac]/20 via-transparent to-black" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <Flame className="text-primary fill-current" size={40} />
          <span className="text-3xl font-black tracking-tighter">oa</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-bold text-lg">
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link to="/learn" className="hover:text-primary transition-colors">Learn</Link>
          <Link to="/safety" className="hover:text-primary transition-colors">Safety</Link>
          <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="hidden md:block bg-white text-black px-8 py-2 rounded-full font-bold hover:bg-white/90 transition-all"
          >
            Log in
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-40 bg-black pt-24 px-6 flex flex-col gap-8 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-2xl font-black italic">
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/learn" onClick={() => setIsMobileMenuOpen(false)}>Learn</Link>
              <Link to="/safety" onClick={() => setIsMobileMenuOpen(false)}>Safety</Link>
              <Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
            </nav>
            <div className="flex flex-col gap-4 mt-auto mb-12">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-white text-black py-4 rounded-full font-bold text-xl"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full primary-gradient text-white py-4 rounded-full font-bold text-xl"
              >
                Create account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-9xl font-black italic mb-8"
        >
          Swipe Right<span className="text-primary">®</span>
        </motion.h1>

        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/register')}
          className="primary-gradient text-white px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl"
        >
          Create account
        </motion.button>
      </main>


{/* App Stores Banner */}
<section className="relative z-10 py-12 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="text-center md:text-left">
      <h2 className="text-3xl font-black mb-2">Get the app!</h2>
      <p className="text-dark-text">Available on iOS and Android. Start swiping today.</p>
    </div>
    <div className="flex gap-4">
      <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold">
        <Apple size={24} />
        <div className="text-left leading-none">
          <span className="text-[10px] uppercase block">Download on the</span>
          <span className="text-xl">App Store</span>
        </div>
      </button>
      <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold">
        <PlayCircle size={24} />
        <div className="text-left leading-none">
          <span className="text-[10px] uppercase block">Get it on</span>
          <span className="text-xl">Google Play</span>
        </div>
      </button>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="relative z-10 bg-black py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-black text-xl mb-6">Legal</h4>
            <ul className="space-y-4 text-dark-text font-medium">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-6">Careers</h4>
            <ul className="space-y-4 text-dark-text font-medium">
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/tech-blog" className="hover:text-white transition-colors">Tech Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-6">Social</h4>
            <ul className="space-y-4 text-dark-text font-medium">
              <li><Link to="#" className="hover:text-white">Instagram</Link></li>
              <li><Link to="#" className="hover:text-white">TikTok</Link></li>
              <li><Link to="#" className="hover:text-white">YouTube</Link></li>
              <li><Link to="#" className="hover:text-white">Twitter</Link></li>
              <li><Link to="#" className="hover:text-white">Facebook</Link></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-black text-xl mb-6">Download</h4>
            <p className="text-dark-text mb-6">Oa connects you with people around the corner or across the globe.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-dark-text">© {new Date().getFullYear()} Oa Group, LLC, All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-text">
            <Link to="/support" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/learn" className="hover:text-white transition-colors">Destinations</Link>
            <Link to="/support" className="hover:text-white transition-colors">Press Room</Link>
            <Link to="/support" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;