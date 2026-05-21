import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, ShieldAlert, Zap, Radio } from 'lucide-react';

const SafetyPage = () => {
  const navigate = useNavigate();

  const safetyProtocols = [
    {
      id: "01",
      title: "Uhakiki wa AI",
      label: "MEMBER VERIFICATION",
      desc: "Every profile is scanned by our neural engines. If the vibe is fake or the intent is malicious, they get the boot instantly. No bots allowed in the mambo zone.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,121,172,0.4)]">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#ff79ac" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M30 50 Q50 20 70 50 T30 50" fill="#ff79ac" fillOpacity="0.2" stroke="#ff79ac" strokeWidth="3" />
          <circle cx="50" cy="50" r="8" fill="#ff79ac" />
        </svg>
      )
    },
    {
      id: "02",
      title: "Data Silo",
      label: "ENCRYPTED PRIVACY",
      desc: "Your data is locked in an end-to-end encrypted vault. You control who sees your energy and who stays on the outside.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,121,172,0.4)]">
          <rect x="25" y="40" width="50" height="40" rx="8" fill="none" stroke="#ff79ac" strokeWidth="3" />
          <path d="M35 40 V25 Q50 10 65 25 V40" fill="none" stroke="#ff79ac" strokeWidth="3" />
          <circle cx="50" cy="60" r="5" fill="#ff79ac" />
        </svg>
      )
    },
    {
      id: "03",
      title: "Ripoti Papo Hapo",
      label: "INSTANT ACTION",
      desc: "One tap. Instant intervention. Our safety team operates at light speed to keep the East African community clean and high-vibe.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_12px_rgba(255,121,172,0.4)]">
          <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke="#ff79ac" strokeWidth="3" />
          <rect x="47" y="40" width="6" height="25" fill="#ff79ac" />
          <circle cx="50" cy="75" r="4" fill="#ff79ac" />
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
          alt="Backdrop"
          className="w-full h-full object-cover opacity-20 grayscale"
        />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-8 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <Crown className="text-[#ff79ac] group-hover:rotate-12 transition-transform" size={28} />
          <span className="text-2xl font-black tracking-tighter uppercase italic">mambo</span>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mix-blend-difference hover:text-[#ff79ac] transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
        >
          [ Exit ]
        </button>
      </header>

      <main className="relative z-10">
        {/* Aggressive Hero Section */}
        <section className="h-[70vh] flex flex-col justify-end px-8 md:px-20 pb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            <h1 className="text-[12vw] leading-[0.8] font-black italic uppercase tracking-tighter">
              SAFE <br /> <span className="text-[#ff79ac]">ULINZI</span>
            </h1>
          </motion.div>
        </section>

        {/* Intelligence Modules */}
        <section className="px-8 md:px-20 py-24 grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border-y border-white/10">
          {safetyProtocols.map((protocol, i) => (
            <motion.div
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-12 bg-black hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
            >
              <div className="mb-12">{protocol.icon}</div>
              <span className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase">{protocol.label}</span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mt-2 mb-6 group-hover:text-[#ff79ac] transition-colors">
                {protocol.title}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed font-medium max-w-xs">
                {protocol.desc}
              </p>
              <div className="absolute top-8 right-8 text-white/[0.03] text-8xl font-black italic select-none">
                {protocol.id}
              </div>
            </motion.div>
          ))}
        </section>

        {/* The Rules: Editorial Style */}
        <section className="px-8 md:px-20 py-40">
          <div className="max-w-4xl">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-20 leading-none">
              Street Smarts <br /> <span className="text-white/20">mambo Rules</span>
            </h2>

            <div className="space-y-16">
              {[
                { label: "01", text: "Always meet in a high-energy public spot. Public first, private never.", icon: <Radio size={20} /> },
                { label: "02", text: "Ping the squad. Let your circles know where you are at all times.", icon: <ShieldAlert size={20} /> },
                { label: "03", text: "Trust the vibe. If the energy feels off, ghosting is a survival tool.", icon: <Zap size={20} /> }
              ].map((rule) => (
                <div key={rule.label} className="flex gap-8 group">
                  <span className="text-[#ff79ac] font-black text-2xl group-hover:translate-x-2 transition-transform">{rule.label}.</span>
                  <div className="pb-8 border-b border-white/10 w-full">
                    <p className="text-xl md:text-3xl font-bold text-white/80 group-hover:text-white transition-colors">
                      {rule.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Safety Callout */}
        <section className="px-8 md:px-20 pb-40">
          <div className="bg-[#ff79ac] p-16 md:p-32 rounded-[4rem] text-black relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                Secure <br /> the Vibe
              </h2>
              <button className="px-12 py-6 bg-black text-white rounded-full font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl">
                Enter Safety Center
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 text-black/10 text-[20rem] font-black italic select-none">
              MAMBO
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-20 px-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
          © {new Date().getFullYear()} MAMBO GROUP.
        </div>
      </footer>
    </div>
  );
};

export default SafetyPage;