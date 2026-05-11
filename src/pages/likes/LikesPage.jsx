import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Diamond, Lock, Sparkles, Crown } from 'lucide-react';
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
      {/* Clean Page Header (No Sticky Nav) */}
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-10">
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-[2rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : likers.length > 0 ? (
          <div className="space-y-12">
            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
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
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        !isGold && i > 1 ? 'blur-2xl scale-110 grayscale opacity-40' : 'group-hover:scale-110'
                      }`}
                      alt=""
                    />
                    
                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                    {/* Info Label */}
                    <div className="absolute bottom-5 left-5 right-5">
                      {(isGold || i <= 1) ? (
                        <p className="text-sm font-black italic tracking-tight">
                          {p.name}, {calculateAge(p.birthday)}
                        </p>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                          <Lock size={16} className="text-amber-400 mb-1" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Blurred</span>
                        </div>
                      )}
                    </div>

                    {/* Superlike Indicator */}
                    {p.isSuperLike && (
                      <div className="absolute top-4 left-4 bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/40">
                        <Sparkles size={12} className="text-white fill-current" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Original High-Vibe Upsell Card */}
            {!isGold && (
              <div className="relative group overflow-hidden bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 p-[1px] rounded-[2.5rem]">
                <div className="bg-black rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <Crown size={40} className="mx-auto text-amber-500 mb-4" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Reveal Everyone</h3>
                    <p className="text-zinc-400 text-sm mb-8 px-4 font-medium leading-relaxed">
                      Upgrade to <span className="text-amber-500 font-bold">Mambo Gold</span> to see all {likers.length} people who already liked you.
                    </p>
                    <button className="w-full h-14 bg-amber-500 text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-amber-500/20">
                      Get Gold 5,000 TZS
                    </button>
                  </div>
                  
                  {/* Decorative Glow */}
                  <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[100px]" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-6">
              <Diamond size={40} className="text-white/10" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-widest mb-2 text-white/40">Quiet for now</h2>
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