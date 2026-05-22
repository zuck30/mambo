import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Menu, X, Globe, Apple, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterText = ({ texts }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentFullText.slice(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentFullText.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 150);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, texts]);

  return (
    <span className="text-[#FFFC00] drop-shadow-[0_0_15px_rgba(255,121,172,0.5)]">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1 h-16 md:h-32 bg-[#FFFC00] ml-2 align-middle"
      />
    </span>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const swahiliPhrases = ["Mambo vipi?", "Tokelezea.", "Pata vibe.", "Noma sana."];

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative font-sans antialiased">
      
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation */}
      <header className="absolute top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-12 lg:px-20">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-[#FFFC00] uppercase">mambo</span>
        </motion.div>

        <nav className="hidden lg:flex gap-8 font-bold text-sm uppercase tracking-widest text-white/90">
          {['Products', 'Learn', 'Safety', 'Support'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase()}`} className="hover:text-[#FFFC00] transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFFC00] transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 md:gap-6"
        >
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-black px-4 md:px-8 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm uppercase hover:bg-[#FFFC00] hover:text-white transition-all shadow-xl active:scale-95 whitespace-nowrap"
          >
            Log in
          </button>
          <button className="lg:hidden p-1 text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-[140px] font-black italic leading-none tracking-tighter uppercase select-none">
            Start<br />
            <TypewriterText texts={swahiliPhrases} />
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center gap-8 w-full max-w-sm"
        >
          <button
            onClick={() => navigate('/register')}
            className="group relative bg-theme-yellow text-black px-8 md:px-16 py-4 md:py-5 rounded-full text-xl md:text-2xl font-black uppercase tracking-tighter shadow-2xl overflow-hidden w-full md:w-auto"
          >
            <span className="relative z-10 transition-transform group-hover:scale-110 inline-block">Create account</span>
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </button>

          {/* App Stores Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {[
              { Icon: Apple, label: 'Download on the', store: 'App Store' },
              { Icon: PlayCircle, label: 'Get it on', store: 'Google Play' }
            ].map((btn, i) => (
              <motion.a 
                key={btn.store}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (i * 0.2) }}
                href="#" 
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl hover:border-[#FFFC00]/50 hover:bg-black/60 transition-all group"
              >
                <btn.Icon size={24} className="text-white group-hover:text-[#FFFC00] transition-colors" />
                <div className="text-left leading-tight">
                  <span className="text-[8px] md:text-[10px] uppercase block font-bold opacity-60">{btn.label}</span>
                  <span className="text-base md:text-lg font-black tracking-tight">{btn.store}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer Links */}
      <footer className="absolute bottom-0 w-full z-20 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-widest text-white/60">
          {['Terms', 'Privacy', 'Safety'].map(link => (
            <Link key={link} to={`/${link.toLowerCase()}`} className="hover:text-white transition-colors">{link}</Link>
          ))}
        </div>
        <p className="text-[10px] font-black text-white/30 tracking-[0.2em]">
          © {new Date().getFullYear()} MAMBO GROUP.
        </p>
      </footer>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-black p-8 flex flex-col items-center justify-center"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 p-2 text-white">
              <X size={40} />
            </button>
            <nav className="flex flex-col gap-10 text-center text-5xl font-black italic uppercase tracking-tighter">
              {['Products', 'Learn', 'Safety', 'Support'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FFFC00]">
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
