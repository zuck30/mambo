import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Ghost, Crown, Lock, Search, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LikesPage = () => {
  const { user, profile } = useAuth();
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikers();
  }, []);

  const fetchLikers = async () => {
    try {
      const { data, error } = await supabase
        .from('swipes')
        .select('swiper:profiles!swiper_id(*)')
        .eq('swiped_id', user.id)
        .in('direction', ['like', 'superlike']);

      if (error) throw error;

      const { data: matches } = await supabase
        .from('matches')
        .select('user1_id, user2_id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      const matchedIds = matches?.flatMap(m => [m.user1_id, m.user2_id]) || [];
      const pendingLikers = data
        ?.map(s => s.swiper)
        .filter(p => !matchedIds.includes(p.id)) || [];

      setLikers(pendingLikers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  };

  const isGold = profile?.subscription === 'gold';

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-32">
      {/* Premium theme Header */}
      <header className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden">
            <img src={user?.photoURL || 'https://via.placeholder.com/40'} className="w-full h-full object-cover" />
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
             <Search size={20} className="text-white" />
          </div>
        </div>
        <h1 className="text-xl font-black tracking-tight">Friends</h1>
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
           <Users size={20} className="text-white" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-[2rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : likers.length > 0 ? (
          <div className="space-y-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">Mutual Friends</h2>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {likers.map((p, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={p.id} 
                    className="aspect-[3/4] relative rounded-[2rem] overflow-hidden group border border-white/5 bg-zinc-900/50"
                  >
                    <img
                      src={p.photos[0]}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      alt=""
                    />
                    
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                    {/* Info Label */}
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="text-sm font-black italic tracking-tight">
                        {p.name}, {calculateAge(p.birthday)}
                      </p>
                    </div>

                    {/* Superlike Indicator */}
                    {p.isSuperLike && (
                      <div className="absolute top-4 left-4 bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/40">
                        <Ghost size={12} className="text-white fill-current" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-6">
              <Ghost size={40} className="text-white/10" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-widest mb-2 text-white/40">Quiet for now</h2>
            <p className="text-zinc-500 text-sm max-w-[200px] mx-auto">
              Keep discovering. When someone likes you, they'll show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikesPage;