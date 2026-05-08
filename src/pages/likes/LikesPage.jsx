import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Diamond, Lock } from 'lucide-react';

const LikesPage = () => {
  const { user } = useAuth();
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikers();
  }, []);

  const fetchLikers = async () => {
    try {
      // Find swipes where direction is like and they haven't matched with current user yet
      const { data, error } = await supabase
        .from('swipes')
        .select('swiper:profiles!swipes_swiper_id_fkey(*)')
        .eq('swiped_id', user.id)
        .eq('direction', 'like');

      if (error) throw error;

      // Filter out those already in matches
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
      console.error('Error fetching likers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Diamond size={24} className="text-[#FFD700] fill-current" />
        <h1 className="text-2xl font-black">{likers.length} Likes</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-dark-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : likers.length > 0 ? (
        <div className="flex-grow">
          <div className="grid grid-cols-2 gap-4">
            {likers.map((p, i) => (
              <div key={p.id} className="aspect-[2/3] relative rounded-2xl overflow-hidden group">
                <img
                  src={p.photos[0]}
                  className={`w-full h-full object-cover transition-all ${i > 2 ? 'blur-xl' : ''}`}
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                  <p className={`text-white font-bold ${i > 2 ? 'invisible' : ''}`}>{p.name}, {calculateAge(p.birthday)}</p>
                </div>

                {i > 2 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white p-4 text-center">
                    <Lock size={32} className="mb-2" />
                    <p className="text-xs font-bold uppercase">Upgrade to See</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center bg-dark-card p-6 rounded-2xl border border-white/5">
             <h3 className="text-lg font-black mb-2 italic">See who likes you!</h3>
             <p className="text-dark-text text-sm mb-6">Upgrade to Oa Gold to reveal everyone who's already liked you.</p>
             <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-dark-card font-black px-8 py-3 rounded-full">
               Get Oa Gold
             </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-dark-text py-20">
           <div className="w-24 h-24 rounded-full bg-dark-surface flex items-center justify-center mb-4">
              <Diamond size={48} className="opacity-20" />
           </div>
           <p className="text-lg font-bold">No likes yet</p>
           <p className="text-sm px-10">Keep swiping! When people like you, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

const calculateAge = (birthday) => {
  if (!birthday) return '';
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default LikesPage;
