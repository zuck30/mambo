import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import TinderCard from '../../components/home/TinderCard';
import DiscoverySettingsModal from '../../components/home/DiscoverySettingsModal';
import { AnimatePresence } from 'framer-motion';
import { Flame, Filter, RefreshCcw, X, Star, Heart, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const HomePage = () => {
  const { user, profile } = useAuth();
  const [stack, setStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDiscoveryStack();
  }, [profile]);

  const fetchDiscoveryStack = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      // 1. Get IDs of users already swiped
      const { data: swipedData } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id);

      const swipedIds = swipedData?.map(s => s.swiped_id) || [];
      swipedIds.push(user.id); // Exclude self

      // 2. RPC call for distance filtering or basic query
      // For now, using basic query but with a dummy distance check
      let query = supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${swipedIds.join(',')})`)
        .eq('is_onboarded', true);

      if (profile.show_gender !== 'everyone') {
        const genderMap = { 'men': 'male', 'women': 'female' };
        query = query.eq('gender', genderMap[profile.show_gender]);
      }

      // Age filter
      query = query
        .gte('birthday', formatDate(profile.max_age_pref))
        .lte('birthday', formatDate(profile.min_age_pref));

      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Filter by distance in JS if PostGIS isn't available
      const filteredData = data?.filter(p => {
        if (!profile.latitude || !p.latitude) return true;
        const d = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
        return d <= profile.distance_pref;
      });

      setStack(filteredData || []);
    } catch (error) {
      console.error('Error fetching stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDate = (age) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - age);
    return d.toISOString().split('T')[0];
  };

  const handleSwipe = async (direction, swipedProfile) => {
    // Optimistic UI update
    setStack(prev => prev.filter(p => p.id !== swipedProfile.id));

    try {
      const { error } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: swipedProfile.id,
          direction
        });

      if (error) throw error;

      if (direction === 'like' || direction === 'superlike') {
        checkMatch(swipedProfile);
      }
    } catch (error) {
      toast.error('Swipe failed: ' + error.message);
    }
  };

  const checkMatch = async (otherProfile) => {
    const { data: otherSwipe } = await supabase
      .from('swipes')
      .select('direction')
      .eq('swiper_id', otherProfile.id)
      .eq('swiped_id', user.id)
      .in('direction', ['like', 'superlike'])
      .single();

    if (otherSwipe) {
      // It's a match!
      const { data: match, error } = await supabase
        .from('matches')
        .insert({
          user1_id: user.id,
          user2_id: otherProfile.id
        })
        .select()
        .single();

      if (!error) {
        setMatchedUser(otherProfile);
        setShowMatch(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff79ac', '#ff5280', '#ffffff']
        });
      }
    }
  };

  const handleUpdateFilters = async (filters) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(filters)
        .eq('id', user.id);
      if (error) throw error;
      setShowFilters(false);
      fetchDiscoveryStack();
    } catch (error) {
      toast.error('Failed to update filters');
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col relative overflow-hidden bg-dark">
      <DiscoverySettingsModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        profile={profile}
        onSave={handleUpdateFilters}
      />
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="w-10 h-10 rounded-full bg-dark-surface flex items-center justify-center overflow-hidden border border-white/10">
           {profile?.photos?.[0] ? <img src={profile.photos[0]} className="w-full h-full object-cover" /> : <Flame className="text-primary" />}
        </div>
        <Flame size={32} className="text-primary fill-current" />
        <button
          onClick={() => setShowFilters(true)}
          className="p-2 text-dark-text hover:text-white transition-colors"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* Stack Area */}
      <div className="flex-grow relative px-4 flex items-center justify-center">
        {loading ? (
          <div className="text-primary animate-pulse">Finding people nearby...</div>
        ) : stack.length > 0 ? (
          <AnimatePresence>
            {stack.map((p, i) => (
              <TinderCard
                key={p.id}
                profile={p}
                onSwipe={(dir) => handleSwipe(dir, p)}
                style={{ zIndex: stack.length - i }}
              />
            )).reverse()}
          </AnimatePresence>
        ) : (
          <div className="text-center space-y-4">
             <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center mx-auto">
               <RefreshCcw size={48} className="text-primary/40" />
             </div>
             <p className="text-dark-text font-medium">No more people in your area.</p>
             <button
              onClick={fetchDiscoveryStack}
              className="text-primary font-bold px-6 py-2 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors"
             >
               Try again
             </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="px-6 py-8 flex items-center justify-center gap-4">
        <button className="w-12 h-12 rounded-full border-2 border-yellow-500/50 flex items-center justify-center text-yellow-500 hover:bg-yellow-500/10 transition-colors">
          <RefreshCcw size={20} />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('pass', stack[0])}
          className="w-16 h-16 rounded-full border-2 border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('superlike', stack[0])}
          className="w-12 h-12 rounded-full border-2 border-blue-400/50 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-colors"
        >
          <Star size={24} fill="currentColor" />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('like', stack[0])}
          className="w-16 h-16 rounded-full border-2 border-green-500/50 flex items-center justify-center text-green-500 hover:bg-green-500/10 transition-colors"
        >
          <Heart size={32} fill="currentColor" />
        </button>
        <button className="w-12 h-12 rounded-full border-2 border-purple-500/50 flex items-center justify-center text-purple-500 hover:bg-purple-500/10 transition-colors">
          <Zap size={24} fill="currentColor" />
        </button>
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.h2
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: -5 }}
              className="text-5xl font-black text-primary mb-4 italic"
            >
              It's a Match!
            </motion.h2>
            <p className="text-white mb-8">You and {matchedUser.name} have liked each other.</p>

            <div className="flex gap-0 mb-12 relative">
               <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                className="w-32 h-32 rounded-full border-4 border-white overflow-hidden z-10 shadow-2xl"
               >
                  <img src={profile.photos[0]} className="w-full h-full object-cover" />
               </motion.div>
               <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: -20, opacity: 1 }}
                className="w-32 h-32 rounded-full border-4 border-white overflow-hidden z-0 shadow-2xl"
               >
                  <img src={matchedUser.photos[0]} className="w-full h-full object-cover" />
               </motion.div>
            </div>

            <div className="space-y-4 w-full max-w-xs">
              <button
                onClick={() => setShowMatch(false)}
                className="w-full primary-gradient text-white font-bold py-4 rounded-full shadow-lg"
              >
                Send Message
              </button>
              <button
                onClick={() => setShowMatch(false)}
                className="w-full border border-white/20 text-white font-bold py-4 rounded-full hover:bg-white/10 transition-colors"
              >
                Keep Swiping
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
