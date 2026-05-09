import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import DiscoverCard from '../../components/home/DiscoverCard';
import DiscoverySettingsModal from '../../components/home/DiscoverySettingsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Filter, RefreshCcw, X, Star, Heart, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const HomePage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
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
      const { data: swipedData } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id);

      const swipedIds = swipedData?.map(s => s.swiped_id) || [];
      swipedIds.push(user.id);

      let query = supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${swipedIds.join(',')})`)
        .eq('is_onboarded', true);

      if (profile.show_gender !== 'everyone') {
        const genderMap = { 'men': 'male', 'women': 'female' };
        query = query.eq('gender', genderMap[profile.show_gender]);
      }

      query = query
        .gte('birthday', formatDate(profile.max_age_pref))
        .lte('birthday', formatDate(profile.min_age_pref));

      const { data, error } = await query.limit(100);
      if (error) throw error;

      const filteredData = data?.filter(p => {
        if (!profile.latitude || !p.latitude) return true;
        const d = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
        return d <= (profile.distance_pref || 50);
      });

      // Sort by common interests
      const sortedData = filteredData?.sort((a, b) => {
        const aInterests = a.interests || [];
        const bInterests = b.interests || [];
        const myInterests = profile.interests || [];

        const aCommon = aInterests.filter(i => myInterests.includes(i)).length;
        const bCommon = bInterests.filter(i => myInterests.includes(i)).length;

        return bCommon - aCommon;
      });

      setStack(sortedData || []);
    } catch (error) {
      console.error('Error fetching stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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
    if (!swipedProfile) return;

    // Optimistic update
    setStack(prev => prev.filter(p => p.id !== swipedProfile.id));

    try {
      const { error } = await supabase
        .from('swipes')
        .insert({
          swiper_id: user.id,
          swiped_id: swipedProfile.id,
          direction,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      if (direction === 'like' || direction === 'superlike') {
        await checkMatch(swipedProfile);
      }
    } catch (error) {
      console.error('Swipe error:', error);
      toast.error('Action failed. Please try again.');
    }
  };

  const handleBoost = async () => {
    toast.success('Boost activated! You are now one of the top profiles in your area for 30 minutes.', {
      icon: '⚡',
      duration: 4000
    });
    // In a real app, this would update a 'boosted_until' timestamp in the DB
  };

  const handleRewind = () => {
    toast.error('Get Oa Gold to rewind your last swipe!', {
      icon: '⏪'
    });
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
      const { data: matchData, error } = await supabase
        .from('matches')
        .insert({ user1_id: user.id, user2_id: otherProfile.id })
        .select()
        .single();

      if (!error && matchData) {
        setMatchedUser({ ...otherProfile, matchId: matchData.id });
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
      const { error } = await supabase.from('profiles').update(filters).eq('id', user.id);
      if (error) throw error;
      setShowFilters(false);
      fetchDiscoveryStack();
    } catch (error) {
      toast.error('Failed to update filters');
    }
  };

  const navigateToChat = (matchId) => {
    setShowMatch(false);
    navigate(`/app/chat/${matchId}`);
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black font-sans">
      <DiscoverySettingsModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        profile={profile}
        onSave={handleUpdateFilters}
      />

      {/* Professional Header */}
      <div className="flex items-center justify-between px-6 py-4 z-20">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center overflow-hidden border border-white/10"
        >
           {profile?.photos?.[0] ? <img src={profile.photos[0]} className="w-full h-full object-cover" /> : <Flame className="text-primary" />}
        </motion.div>
        <div className="flex items-center gap-1">
          <Flame size={28} className="text-primary fill-current" />
          <span className="font-black text-2xl italic tracking-tighter">oa</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(true)}
          className="p-2 text-dark-text hover:text-white transition-colors"
        >
          <Filter size={24} />
        </motion.button>
      </div>

      {/* Stack Area */}
      <div className="flex-grow relative px-4 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-primary font-bold animate-pulse">Finding people nearby...</p>
          </div>
        ) : stack.length > 0 ? (
          <AnimatePresence>
            {stack.map((p, i) => (
              <DiscoverCard
                key={p.id}
                profile={p}
                onSwipe={(dir) => handleSwipe(dir, p)}
                style={{ zIndex: stack.length - i }}
              />
            )).reverse()}
          </AnimatePresence>
        ) : (
          <div className="text-center space-y-6 max-w-xs">
             <div className="w-32 h-32 rounded-full bg-dark-card border border-white/5 flex items-center justify-center mx-auto shadow-2xl">
               <RefreshCcw size={48} className="text-dark-text animate-spin-slow" />
             </div>
             <div>
               <p className="text-white text-xl font-bold mb-2">No more discovery</p>
               <p className="text-dark-text text-sm">Expand your filters to see more people in your area.</p>
             </div>
             <button
              onClick={() => setShowFilters(true)}
              className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg"
             >
               Discovery Settings
             </button>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="px-6 py-8 flex items-center justify-center gap-4 z-20">
        <button
          onClick={handleRewind}
          className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-yellow-500 shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <RefreshCcw size={20} />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('pass', stack[0])}
          className="w-16 h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-red-500 shadow-xl hover:scale-110 active:scale-95 transition-transform"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('superlike', stack[0])}
          className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-blue-400 shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
          <Star size={24} fill="currentColor" />
        </button>
        <button
          onClick={() => stack[0] && handleSwipe('like', stack[0])}
          className="w-16 h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-green-500 shadow-xl hover:scale-110 active:scale-95 transition-transform"
        >
          <Heart size={32} fill="currentColor" />
        </button>
        <button
          onClick={handleBoost}
          className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-purple-500 shadow-lg hover:scale-110 active:scale-95 transition-transform"
        >
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
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4 mb-12"
            >
              <h2 className="text-6xl font-black text-primary italic">Match!</h2>
              <p className="text-white text-xl">You and {matchedUser.name} liked each other.</p>
            </motion.div>

            <div className="flex gap-0 mb-16">
               <motion.div
                initial={{ x: -100, rotate: -20, opacity: 0 }}
                animate={{ x: 20, rotate: -10, opacity: 1 }}
                className="w-40 h-40 rounded-full border-4 border-white overflow-hidden z-10 shadow-2xl"
               >
                  <img src={profile.photos[0]} className="w-full h-full object-cover" />
               </motion.div>
               <motion.div
                initial={{ x: 100, rotate: 20, opacity: 0 }}
                animate={{ x: -20, rotate: 10, opacity: 1 }}
                className="w-40 h-40 rounded-full border-4 border-white overflow-hidden z-0 shadow-2xl"
               >
                  <img src={matchedUser.photos[0]} className="w-full h-full object-cover" />
               </motion.div>
            </div>

            <div className="space-y-4 w-full max-w-xs">
              <button
                onClick={() => navigateToChat(matchedUser.matchId)}
                className="w-full primary-gradient text-white font-black py-4 rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                SEND A MESSAGE
              </button>
              <button
                onClick={() => setShowMatch(false)}
                className="w-full border-2 border-white/20 text-white font-black py-4 rounded-full hover:bg-white/10 transition-all"
              >
                KEEP SWIPING
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
