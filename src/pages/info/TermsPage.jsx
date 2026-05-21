import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, Scale, Gavel, Globe, Ban } from 'lucide-react';

const TermsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: "01",
      title: "Kukubali Masharti",
      label: "ACCEPTANCE",
      desc: "By creating a mambo account, you agree to be bound by these Terms. If you do not agree, do not use the service.",
      icon: <Scale className="text-[#ff79ac]" size={24} />
    },
    {
      id: "02",
      title: "Umri na Vigezo",
      label: "ELIGIBILITY",
      desc: "You must be at least 18 years of age to create an account and use mambo.",
      icon: <Gavel className="text-[#ff79ac]" size={24} />
    },
    {
      id: "03",
      title: "Matumizi ya Dunia",
      label: "GLOBAL USAGE",
      desc: "mambo is for a global audience. You are responsible for complying with your local jurisdiction's laws.",
      icon: <Globe className="text-[#ff79ac]" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff79ac] overflow-x-hidden font-sans antialiased">
      {/* Cinematic Backdrop */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-10" />
        <img 
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Backdrop"
          className="w-full h-full object-cover opacity-10 grayscale scale-150"
        />
      </div>

      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#ff79ac] fill-current" size={28} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="text-white/40 hover:text-[#ff79ac] transition-all font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2"
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
              TERMS OF <br /> <span className="text-white/20">SERVICE</span>
            </h1>

          </motion.div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border-y border-white/10 mb-32">
          {sections.map((section) => (
            <div key={section.id} className="p-12 bg-black hover:bg-white/[0.02] transition-colors relative group">
              <div className="mb-8">{section.icon}</div>
              <span className="text-[10px] font-black tracking-[0.3em] text-white/30 uppercase">{section.label}</span>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-2 mb-6 group-hover:text-[#ff79ac] transition-colors">{section.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed">{section.desc}</p>
            </div>
          ))}
        </section>

        <section className="mb-32">
          <div className="flex items-center gap-4 mb-16">
            <Ban className="text-red-500" size={24} />
            <h2 className="text-sm font-black uppercase tracking-[0.6em] text-white/40">Prohibited Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              "Offensive, abusive, or discriminatory content.",
              "Sexually explicit content or pornography.",
              "Harassment, threats, or intimidation.",
              "Illegal activities or promotion of crime."
            ].map((rule, i) => (
              <div key={i} className="flex gap-6 border-l-2 border-red-500/30 pl-8 py-4 bg-red-500/[0.02]">
                <span className="text-red-500 font-black italic text-xl">!</span>
                <p className="text-xl font-bold tracking-tight text-white/80">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">Termination</h2>
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium">
              We reserve the right to terminate or suspend your account at any time, without notice, for conduct that violates these Terms or is harmful to other users.
            </p>
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

export default TermsPage;