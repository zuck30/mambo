import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, Mail, Phone, MessageSquare, LifeBuoy } from 'lucide-react';

const SupportPage = () => {
  const navigate = useNavigate();

  const contactMethods = [
    {
      title: "Msaada Papo Hapo",
      label: "LIVE CONCIERGE",
      desc: "Real-time vibes. Speak with our local support team 24/7.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,121,172,0.4)]">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ff79ac" strokeWidth="2" strokeDasharray="10 5" />
          <path d="M30 50 Q50 80 70 50" fill="none" stroke="#ff79ac" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="45" r="5" fill="#ff79ac" />
        </svg>
      )
    },
    {
      title: "Maktaba ya Mambo",
      label: "VIBE CENTER",
      desc: "The full manual on how to navigate the mambo ecosystem like a pro.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,121,172,0.4)]">
          <rect x="25" y="25" width="50" height="50" rx="4" fill="none" stroke="#ff79ac" strokeWidth="3" />
          <path d="M25 40 H75 M25 55 H75 M25 70 H55" stroke="#ff79ac" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ff79ac] selection:text-white overflow-x-hidden font-sans antialiased">
      {/* Background Layering */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-10" />
        <img 
          src="https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png" 
          alt="Support Backdrop"
          className="w-full h-full object-cover opacity-20 grayscale scale-125"
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#ff79ac] group-hover:rotate-12 transition-transform" size={28} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mix-blend-difference hover:text-[#ff79ac] transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Return to mambo
        </button>
      </header>

      <main className="relative z-10">
        {/* Cinematic Title Section */}
        <section className="h-[60vh] flex flex-col justify-end px-8 md:px-20 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h1 className="text-[12vw] leading-[0.8] font-black italic uppercase tracking-tighter">
              HELP <br /> <span className="text-white/20">CENTER</span>
            </h1>
          </motion.div>
        </section>

        {/* Support Grid */}
        <section className="px-8 md:px-20 py-24 grid grid-cols-1 md:grid-cols-2 gap-1px bg-white/10 border-y border-white/10">
          {contactMethods.map((method, i) => (
            <motion.div
              key={method.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-16 bg-black hover:bg-white/[0.02] transition-all group"
            >
              <div className="mb-12 transform group-hover:scale-110 transition-transform duration-500">
                {method.icon}
              </div>
              <span className="text-[#ff79ac] text-[10px] font-black tracking-[0.4em] uppercase">
                {method.label}
              </span>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-4 mb-6">
                {method.title}
              </h2>
              <p className="text-white/40 text-lg leading-relaxed max-w-sm">
                {method.desc}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Contact Info Editorial */}
        <section className="px-8 md:px-20 py-40 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-10 leading-none">
                Reach <br /> <span className="text-[#ff79ac]">Directly</span>
              </h2>
              <div className="space-y-12">
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-black tracking-[0.4em] text-white/30 block mb-2 underline decoration-[#ff79ac] underline-offset-8">EMAIL</span>
                  <p className="text-3xl md:text-5xl font-black italic tracking-tighter hover:text-[#ff79ac] transition-colors">support@mambo.com</p>
                </div>
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-black tracking-[0.4em] text-white/30 block mb-2 underline decoration-[#ff79ac] underline-offset-8">OFFICE</span>
                  <p className="text-3xl md:text-5xl font-black italic tracking-tighter hover:text-[#ff79ac] transition-colors">Dar Es Salaam, TZ</p>
                </div>
              </div>
            </div>
            
            {/* FAQ Module */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
              <h3 className="text-2xl font-black italic uppercase tracking-widest mb-12 border-b border-white/10 pb-6">Common Intel</h3>
              <div className="space-y-12">
                <div>
                  <h4 className="text-[#ff79ac] font-black uppercase text-[10px] tracking-widest mb-3">Login & Security</h4>
                  <p className="text-xl font-bold text-white/80 leading-snug">No passwords. We use Email OTP. Your inbox is the key to your mambo vault.</p>
                </div>
                <div>
                  <h4 className="text-[#ff79ac] font-black uppercase text-[10px] tracking-widest mb-3">Account Purge</h4>
                  <p className="text-xl font-bold text-white/80 leading-snug">Permanent deletion is handled directly in Settings. Once your vibe is gone, it is gone.</p>
                </div>
              </div>
              <div className="absolute top-[-50px] right-[-50px] text-white/[0.02] text-[15rem] font-black italic pointer-events-none">?</div>
            </div>
          </div>
        </section>

        {/* Final Branding Block */}
        <section className="px-8 md:px-20 py-40 text-center">
          <LifeBuoy className="mx-auto text-white/10 mb-8" size={120} />
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4 text-white/20">
            We are always <span className="text-white">Listening.</span>
          </h2>
        </section>
      </main>

      <footer className="relative z-10 py-12 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em]">
          © {new Date().getFullYear()} MAMBO GROUP.
        </p>
      </footer>
    </div>
  );
};

export default SupportPage;