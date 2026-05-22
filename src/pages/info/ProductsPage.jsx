import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, Zap, ShieldCheck, Globe } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();

  const products = [
    {
      name: "mambo Core",
      id: "BASIC",
      color: "text-[#FFFC00]",
      glow: "shadow-[0_0_50px_rgba(255,121,172,0.2)]",
      description: "Our flagship foundation for high-energy Tanzanian connections.",
      features: ["Global Reach", "Smart Matching", "Daily Vibe Checks"],
      buttonText: "Join the Vibe",
      icon: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,121,172,0.4)]">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFFC00" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M30 50 Q50 20 70 50 T30 50" fill="#FFFC00" fillOpacity="0.2" stroke="#FFFC00" strokeWidth="3" />
          <circle cx="50" cy="50" r="8" fill="#FFFC00" />
        </svg>
      )
    },
    {
      name: "mambo Gold",
      id: "ELITE",
      color: "text-amber-400",
      glow: "shadow-[0_0_50px_rgba(251,191,36,0.2)]",
      description: "Elevate your status. Unlimited likes and global passport access.",
      features: ["Unlimited Likes", "See Who Likes You", "Passport Mode"],
      buttonText: "Go Gold",
      popular: true,
      icon: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
          <rect x="25" y="25" width="50" height="50" rx="12" fill="none" stroke="#fbbf24" strokeWidth="2" transform="rotate(45 50 50)" />
          <path d="M50 30 L60 50 L80 55 L65 70 L70 90 L50 80 L30 90 L35 70 L20 55 L40 50 Z" fill="#fbbf24" />
        </svg>
      )
    },
    {
      name: "mambo Platinum",
      id: "ULTIMATE",
      color: "text-cyan-400",
      glow: "shadow-[0_0_50px_rgba(34,211,238,0.2)]",
      description: "The peak of the ecosystem. Priority messaging and exclusive matching.",
      features: ["Priority Likes", "Message Before Match", "Full Invisible Mode"],
      buttonText: "Get Platinum",
      icon: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <path d="M50 15 L85 40 L70 85 L30 85 L15 40 Z" fill="none" stroke="#22d3ee" strokeWidth="2" />
          <path d="M50 25 L75 45 L50 80 L25 45 Z" fill="#22d3ee" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFFC00] overflow-x-hidden font-sans antialiased">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-10" />
        <img 
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Backdrop"
          className="w-full h-full object-cover opacity-20 grayscale"
        />
      </div>

      <header className="relative z-50 flex items-center justify-between px-8 py-10">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#FFFC00] fill-current group-hover:rotate-12 transition-transform" size={30} />
          <span className="text-3xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="text-white/40 hover:text-[#FFFC00] transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Exit 
        </button>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <section className="pt-10 pb-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[12vw] md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.8] mb-6"
          >
            Tier <span className="text-[#FFFC00]">Up.</span>
          </motion.h1>
          <p className="text-white/30 text-xs font-black uppercase tracking-[0.8em]">Select Your Access Level</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-40">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`group bg-white/5 backdrop-blur-3xl border ${product.popular ? 'border-[#FFFC00]/50' : 'border-white/10'} p-12 rounded-[3.5rem] relative overflow-hidden hover:bg-white/[0.08] transition-all duration-700 ${product.glow}`}
            >
              {product.popular && (
                <div className="absolute top-0 right-0 bg-[#FFFC00] text-black font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-bl-3xl">
                  Recommended
                </div>
              )}

              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase block mb-8 underline underline-offset-8 decoration-[#FFFC00]/40">
                {product.id}SECURE
              </span>

              <div className="mb-10 transform group-hover:scale-110 transition-transform duration-700">
                {product.icon}
              </div>

              <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-4 ${product.color}`}>
                {product.name}
              </h2>
              
              <p className="text-white/50 text-sm font-medium mb-12 leading-relaxed">
                {product.description}
              </p>
              
              <div className="space-y-6 mb-16">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                    <Zap size={14} className={product.color} />
                    {feature}
                  </div>
                ))}
              </div>

              <button className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 ${
                product.popular 
                ? 'bg-[#FFFC00] text-black hover:scale-105 shadow-2xl'
                : 'bg-white/10 text-white hover:bg-[#FFFC00] hover:text-black'
              }`}>
                {product.buttonText}
              </button>

              <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-9xl font-black italic pointer-events-none group-hover:text-white/[0.05] transition-colors">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-16 px-8 border-t border-white/5 flex flex-col items-center">
        <div className="flex gap-12 mb-8 opacity-20">
          <Globe size={20} />
        </div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} MAMBO.
        </p>
      </footer>
    </div>
  );
};

export default ProductsPage;