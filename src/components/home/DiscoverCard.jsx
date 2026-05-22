import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Info, Ghost , Heart } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';

const DiscoverCard = ({ profile, onSwipe, onClick }) => {
  const { language } = useAuthStore();
  const t = translations[language];
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-150, 150], [-12, 12]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);

  // Smoother technical indicators
  const likeOpacity = useTransform(x, [60, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -60], [1, 0]);
  const superLikeOpacity = useTransform(y, [-120, -60], [1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 120;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    } else if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
      onSwipe('superlike');
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  };

  const getGoalIcon = (goal) => {
    const goals = {
      'Long-term partner': '💘',
      'Long-term, open to short': '😍',
      'Short-term, open to long': '🥂',
      'Short-term fun': '🎉',
      'New friends': '👋',
      'Still figuring it out': '🤔'
    };
    return goals[goal] || '✨';
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className="absolute w-full h-[70vh] md:h-[75vh] cursor-grab active:cursor-grabbing z-10"
    >
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-black border border-white/5 shadow-2xl">
        <img
          src={profile.photos?.[0] || 'https://via.placeholder.com/400x600'}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none transition-all duration-1000 grayscale-[0.2] hover:grayscale-0 hover:scale-105"
        />

        {/* Technical Status Indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 px-6 py-2 rounded-2xl bg-white text-black font-black text-2xl uppercase tracking-tighter -rotate-12 border border-white/20 shadow-xl"
        >
          Match
        </motion.div>
        
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-10 px-6 py-2 rounded-2xl bg-zinc-900/80 backdrop-blur-md text-white font-black text-2xl uppercase tracking-tighter rotate-12 border border-white/10"
        >
          Skip
        </motion.div>

        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-blue-500 text-white font-black text-2xl uppercase tracking-tighter border border-blue-400 flex items-center gap-2"
        >
          <Ghost size={20} className="fill-current" />
          Elite
        </motion.div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black tracking-tighter uppercase text-white">
                  {profile.name}
                </h3>
                <span className="text-2xl font-bold text-white/50">{calculateAge(profile.birthday)}</span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                  <MapPin size={12} className="text-zinc-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                    {profile.location_name || 'Nearby'}
                  </span>
                </div>
                {profile.commonInterestsCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full">
                    <Heart size={12} className="text-primary fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      {profile.commonInterestsCount} {t.shared}
                    </span>
                  </div>
                )}
                {profile.relationship_goal && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                    <span className="text-xs">{getGoalIcon(profile.relationship_goal)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {profile.relationship_goal}
                    </span>
                  </div>
                )}
                {profile.job && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                      {profile.job}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-black">
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverCard;