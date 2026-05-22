import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, MousePointer2 } from 'lucide-react';

const LearnPage = () => {
  const navigate = useNavigate();

  const vibeSections = [
    {
      id: "01",
      title: "Jitambulishe",
      subtitle: "REAL RECOGNIZES REAL",
      content: "Forget the boring bios. In mambo, your profile is your digital aura. In Mambo We make sure your first impression is cinematic.",
      glow: "bg-[#FFFC00]/20"
    },
    {
      id: "02",
      title: "Vumbua",
      subtitle: "BEYOND THE MAP",
      content: "Whenever you are, Mambo connects you to the vibe. Optimized for our local networks so you never miss a match while on the move.",
      glow: "bg-blue-500/10"
    },
    {
      id: "03",
      title: "Vibe Cheki",
      subtitle: "ENERGY NEVER LIES",
      content: "Swipe right with intent. When the energy is mutual, the sparks are native. No games, just real connections tailored for the East African soul.",
      glow: "bg-amber-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFFC00] selection:text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />
        <img 
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Backdrop"
          className="w-full h-full object-cover opacity-20 grayscale"
        />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#FFFC00] group-hover:rotate-12 transition-transform" size={28} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mix-blend-difference hover:text-[#FFFC00] transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Go Back 
        </button>
      </header>

      {/* Main Experience */}
      <main className="relative z-10">
        {/* Hero: Minimalist & Aggressive */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-[15vw] leading-[0.8] font-black italic uppercase tracking-tighter mb-8">
              THE <span className="text-[#FFFC00]">VIBE</span> <br /> MANUAL
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/40 font-bold uppercase tracking-[0.5em] text-[10px]">
              <span>Scroll to explore</span>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <MousePointer2 size={14} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Content Blocks */}
        <div className="px-6 md:px-20 pb-40">
          {vibeSections.map((section, index) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ margin: "-100px" }}
              className={`relative mb-40 flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'} text-left`}
            >
              <div className={`absolute -inset-20 ${section.glow} blur-[120px] rounded-full pointer-events-none opacity-50`} />
              
              <div className="relative max-w-2xl">
                <span className="text-[#FFFC00] font-black italic text-6xl opacity-20 block mb-2">{section.id}</span>
                <h2 className="text-sm font-black tracking-[0.6em] text-white/40 uppercase mb-4">{section.subtitle}</h2>
                <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8">{section.title}</h3>
                <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed border-l-2 border-[#FFFC00]/30 pl-8">
                  {section.content}
                </p>
              </div>
            </motion.section>
          ))}

          {/* Final Call to Action */}
          <motion.section 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="bg-white text-black p-12 md:p-24 rounded-[3rem] flex flex-col items-center text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Crown size={200} />
            </div>
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8">
              Ready to <br /> mambo?
            </h2>
            <p className="text-black/60 font-bold uppercase tracking-widest text-sm mb-12 max-w-md">
              Join the community built for East African excellence.
            </p>
            <button className="px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform">
              Join the Vibe
            </button>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 py-20 px-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
          © {new Date().getFullYear()} MAMBO GROUP.
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          <a href="#" className="hover:text-[#FFFC00]">Terms</a>
          <a href="#" className="hover:text-[#FFFC00]">Privacy</a>
          <a href="#" className="hover:text-[#FFFC00]">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LearnPage;