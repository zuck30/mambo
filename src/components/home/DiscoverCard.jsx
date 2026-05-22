import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Info, Ghost , Heart, Flame } from 'lucide-react';
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
      className="absolute w-full h-full cursor-grab active:cursor-grabbing z-10 p-2"
    >
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl">
        <img
          src={profile.photos?.[0] || 'https://via.placeholder.com/400x600'}
          alt={profile.name}
          className="w-full h-full object-cover pointer-events-none transition-all duration-1000 grayscale-[0.2] hover:grayscale-0 hover:scale-105"
        />

        {/* Status Indicators */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-10 left-10 px-6 py-2 rounded-2xl bg-theme-yellow text-black font-black text-2xl uppercase tracking-tighter -rotate-12 border-2 border-black shadow-xl"
        >
          Sweet
        </motion.div>
        
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-10 right-10 px-6 py-2 rounded-2xl bg-zinc-900/80 backdrop-blur-md text-white font-black text-2xl uppercase tracking-tighter rotate-12 border border-white/10"
        >
          Next
        </motion.div>

        <motion.div
          style={{ opacity: superLikeOpacity }}
          className="absolute top-20 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-theme-yellow text-black font-black text-2xl uppercase tracking-tighter border-2 border-black flex items-center gap-2"
        >
          <Flame size={20} className="fill-current" />
          Fire
        </motion.div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-black tracking-tighter uppercase text-white leading-none">
                  {profile.name}
                </h3>
                <span className="text-2xl font-black text-theme-yellow italic leading-none">{calculateAge(profile.birthday)}</span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap max-w-[240px]">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                  <MapPin size={10} className="text-theme-yellow" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    {profile.location_name || 'Nearby'}
                  </span>
                </div>
                {profile.commonInterestsCount > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-theme-yellow border border-black rounded-xl">
                    <Heart size={10} className="text-black fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-black">
                      {profile.commonInterestsCount} Shared
                    </span>
                  </div>
                )}
                {profile.relationship_goal && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl">
                    <span className="text-xs">{getGoalIcon(profile.relationship_goal)}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/70">
                      {profile.relationship_goal}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button className="w-14 h-14 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white transition-all hover:bg-theme-yellow hover:text-black hover:border-black active:scale-95">
              <Info size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscoverCard;