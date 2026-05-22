import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, Fingerprint, Database, Eye, Globe } from 'lucide-react';

const PrivacyPage = () => {
  const navigate = useNavigate();

  const privacyModules = [
    {
      id: "01",
      title: "Utangulizi",
      label: "INTRODUCTION",
      desc: "mambo is committed to your privacy. We operate across Tanzania, East Africa, and globally, ensuring your data is handled under strict protection standards.",
      icon: <Fingerprint className="text-[#FFFC00]" size={24} />
    },
    {
      id: "02",
      title: "Data Tunazokusanya",
      label: "COLLECTION",
      desc: "We collect info you provide: email, phone, profile photos, and location (with your permission) to build your digital vibe.",
      icon: <Database className="text-[#FFFC00]" size={24} />
    },
    {
      id: "03",
      title: "Matumizi ya Data",
      label: "USAGE",
      desc: "We use your intel to maintain services, facilitate matches, verify identity, and keep the ecosystem secure from fraud.",
      icon: <Eye className="text-[#FFFC00]" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFFC00] overflow-x-hidden font-sans antialiased">
      {/* Background Matrix */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-10" />
        <img 
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Privacy Backdrop"
          className="w-full h-full object-cover opacity-10 grayscale scale-150"
        />
      </div>

      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#FFFC00] fill-current" size={28} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="text-white/40 hover:text-[#FFFC00] transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-40">
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-7xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.8] mb-8">
              PRIVACY <br /> <span className="text-white/20">POLICY</span>
            </h1>

          </motion.div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border-y border-white/10 mb-32">
          {privacyModules.map((module) => (
            <div key={module.id} className="p-12 bg-black hover:bg-white/[0.02] transition-colors relative group">
              <div className="mb-8">{module.icon}</div>
              <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">{module.label}</span>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-2 mb-6 group-hover:text-[#FFFC00] transition-colors">{module.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed">{module.desc}</p>
            </div>
          ))}
        </section>

        {/* Global Transfer Section */}
        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <Globe className="text-[#FFFC00] shrink-0" size={60} />
            <div>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">Global Transfers</h2>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                As a global platform, your information may be processed in countries other than your own. We ensure appropriate safeguards are in place to meet international data protection standards.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-16 px-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.8em]">
          © {new Date().getFullYear()} MAMBO GROUP.
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPage;