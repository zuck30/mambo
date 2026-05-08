import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Info } from 'lucide-react';

const DiscoverCard = ({ profile, onSwipe, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-100, 100], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [50, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -50], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, -50], [1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    } else if (info.offset.y < -100) {
      onSwipe('superlike');
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className="absolute w-full h-[75vh] cursor-grab active:cursor-grabbing z-10"
    >
      <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-2xl bg-dark-card border border-white/5">
        <img
          src={profile.photos[0] || 'https://via.placeholder.com/400x600'}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none transition-transform duration-500 hover:scale-105"
        />

        {/* Indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-8 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-1 rounded-xl rotate-[-20deg] uppercase tracking-tighter"
        >
          Like
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-8 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-1 rounded-xl rotate-[20deg] uppercase tracking-tighter"
        >
          Nope
        </motion.div>
        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute top-20 left-1/2 -translate-x-1/2 border-4 border-blue-400 text-blue-400 font-black text-4xl px-4 py-1 rounded-xl uppercase tracking-tighter"
        >
          Super Like
        </motion.div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black text-white">{profile.name}</h3>
                <span className="text-3xl font-medium text-white">{calculateAge(profile.birthday)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90 font-medium">
                <MapPin size={18} className="text-primary" />
                <span>{profile.location_name || 'Nearby'}</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Info size={24} />
            </button>
          </div>

          {profile.job && (
             <div className="mt-4 flex items-center gap-2 text-dark-text text-sm font-medium">
               <span className="bg-white/10 px-3 py-1 rounded-full">{profile.job}</span>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverCard;
