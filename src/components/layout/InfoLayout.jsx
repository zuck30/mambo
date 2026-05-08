import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronLeft } from 'lucide-react';

const InfoLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="text-primary fill-current" size={32} />
            <span className="text-2xl font-black tracking-tighter">oa</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-black mb-8">{title}</h1>
        <div className="prose prose-invert prose-pink max-w-none">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-dark-text text-sm">
          <p>© {new Date().getFullYear()} Oa Group, LLC.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoLayout;
