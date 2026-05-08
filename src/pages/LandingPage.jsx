import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Apple, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

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
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <Flame className="text-primary fill-current" size={40} />
          <span className="text-3xl font-black tracking-tighter">oa</span>
        </div>
        <nav className="hidden md:flex gap-8 font-bold text-lg">
          <Link to="#" className="hover:text-primary transition-colors">Products</Link>
          <Link to="#" className="hover:text-primary transition-colors">Learn</Link>
          <Link to="#" className="hover:text-primary transition-colors">Safety</Link>
          <Link to="#" className="hover:text-primary transition-colors">Support</Link>
        </nav>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-black px-8 py-2 rounded-full font-bold hover:bg-white/90 transition-all"
        >
          Log in
        </button>
      </header>

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
          onClick={() => navigate('/login')}
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
              <li><Link to="#" className="hover:text-white">Privacy</Link></li>
              <li><Link to="#" className="hover:text-white">Terms</Link></li>
              <li><Link to="#" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xl mb-6">Careers</h4>
            <ul className="space-y-4 text-dark-text font-medium">
              <li><Link to="#" className="hover:text-white">Tech Blog</Link></li>
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
          <div className="flex gap-6 text-sm text-dark-text">
            <Link to="#" className="hover:text-white">FAQ</Link>
            <Link to="#" className="hover:text-white">Destinations</Link>
            <Link to="#" className="hover:text-white">Press Room</Link>
            <Link to="#" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;