import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronLeft } from 'lucide-react';

const InfoLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 h-16">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black italic tracking-tighter uppercase text-theme-yellow">mambo</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-10">{title}</h1>
        <div className="prose prose-invert prose-zinc max-w-none">
          {children}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Mambo Group</p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoLayout;