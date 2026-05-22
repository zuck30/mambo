import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Map as MapIcon, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-black relative overflow-hidden font-sans">
      {/* Map Content Placeholder */}
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1,0/600x600?access_token=pk.placeholder')] bg-cover opacity-40 grayscale" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/20 shadow-xl pointer-events-auto"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex-1 mx-4 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md h-10 rounded-full border-2 border-white/20 flex items-center px-4 gap-3 shadow-lg">
            <Search size={18} className="text-zinc-400" />
            <input type="text" placeholder="Search Map" className="bg-transparent border-none outline-none text-sm w-full font-bold" />
          </div>
        </div>
      </header>

      {/* Center Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <motion.div
           animate={{ scale: [1, 1.1, 1] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-32 h-32 rounded-full bg-theme-blue/20 border-2 border-white flex items-center justify-center"
         >
            <div className="w-4 h-4 bg-theme-blue rounded-full border-2 border-white shadow-lg" />
         </motion.div>
      </div>

      {/* Floating Actions */}
      <div className="absolute bottom-32 right-6 space-y-4">
         <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-theme-blue shadow-2xl">
            <Navigation size={24} fill="currentColor" />
         </button>
         <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border-2 border-white/20 flex items-center justify-center text-white shadow-2xl">
            <MapIcon size={24} />
         </button>
      </div>

      {/* Overlay Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
         <h2 className="text-2xl font-black uppercase tracking-tighter text-theme-blue drop-shadow-lg">Mambo Map</h2>
         <p className="text-xs font-bold text-white uppercase tracking-widest drop-shadow-md">Coming Soon to Mambo</p>
      </div>
    </div>
  );
};

export default MapPage;
