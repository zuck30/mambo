import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin } from 'lucide-react';

const TinderCard = ({ profile, onSwipe, onClick }) => {
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
      className="absolute w-full h-[70vh] cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl bg-dark-card">
        <img
          src={profile.photos[0] || 'https://via.placeholder.com/400x600'}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Swiping Indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-2 rounded-lg rotate-[-20deg] uppercase"
        >
          Like
        </motion.div>
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-10 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-2 rounded-lg rotate-[20deg] uppercase"
        >
          Nope
        </motion.div>
        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 border-4 border-blue-400 text-blue-400 font-black text-4xl px-4 py-2 rounded-lg uppercase"
        >
          Super Like
        </motion.div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{profile.name}</h3>
            <span className="text-2xl text-white">{calculateAge(profile.birthday)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-white/80">
            <MapPin size={16} />
            <span>{profile.location_name || 'Nearby'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TinderCard;
