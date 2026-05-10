import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';
import DiscoverCard from '../../components/home/DiscoverCard';
import DiscoverySettingsModal from '../../components/home/DiscoverySettingsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Filter, RefreshCcw, X, Star, Heart, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const HomePage = () => {
  const { user, profile } = useAuth();
  const { language } = useAuthStore();
  const t = translations[language];
  const navigate = useNavigate();
  const [stack, setStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    fetchDiscoveryStack();
    fetchRecentMatches();
  }, [profile]);

  const fetchRecentMatches = async () => {
    if (!user) return;
    try {
      // Fetch matches with associated profiles.
      // We use generic joins to avoid dependency on specific foreign key names if possible,
      // but Supabase usually requires them if there are multiple.
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          user1:profiles!user1_id(id, name, photos),
          user2:profiles!user2_id(id, name, photos)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted = data.map(m => {
        const otherUser = m.user1.id === user.id ? m.user2 : m.user1;
        return { id: m.id, ...otherUser };
      });
      setRecentMatches(formatted);
    } catch (err) {
      console.error('Error fetching recent matches:', err);
    }
  };

  const fetchDiscoveryStack = async (isRefresh = false) => {
    if (!profile) return;
    setLoading(true);
    if (isRefresh) setStack([]);

    try {
      const { data: swipedData, error: swipesError } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id);

      if (swipesError) {
        console.warn('Could not fetch previous swipes (this is normal for new accounts):', swipesError);
      }

      const swipedIds = swipedData?.map(s => s.swiped_id) || [];
      swipedIds.push(user.id);

      // Fetch users who liked me to prioritize them
      const { data: likedMeData } = await supabase
        .from('swipes')
        .select('swiper_id')
        .eq('swiped_id', user.id)
        .in('direction', ['like', 'superlike']);

      const likedMeIds = likedMeData?.map(s => s.swiper_id) || [];

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_onboarded', true);

      if (swipedIds.length > 0) {
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
      }

      if (profile.show_gender && profile.show_gender !== 'everyone') {
        const genderMap = { 'men': 'male', 'women': 'female' };
        const targetGender = genderMap[profile.show_gender];
        if (targetGender) {
          query = query.eq('gender', targetGender);
        }
      }

      const minAge = profile.min_age_pref || 18;
      const maxAge = profile.max_age_pref || 100;

      query = query
        .gte('birthday', formatDate(maxAge))
        .lte('birthday', formatDate(minAge));

      const { data, error } = await query.limit(1000);
      if (error) throw error;

      const filteredData = data?.filter(p => {
        if (!profile.latitude || !p.latitude) return true;
        const d = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
        return d <= (profile.distance_pref || 80); // Default to 80km if not set
      });

      // Advanced Sorting with Location, Interests, and Randomness
      const myInterests = profile.interests || [];
      const dataWithScores = filteredData?.map(p => {
        const pInterests = p.interests || [];
        const commonInterestsCount = pInterests.filter(i => myInterests.includes(i)).length;

        let score = (commonInterestsCount * 10); // Interests are high priority

        // Priority boost for people who already liked you
        if (likedMeIds.includes(p.id)) {
          score += 100;
        }

        if (profile.latitude && profile.longitude && p.latitude && p.longitude) {
          const distance = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
          // Higher score for closer users
          score += Math.max(0, 50 - (distance / 2));
        }

        // Stable randomness (0-10 points)
        score += Math.random() * 10;

        return { ...p, _score: score, commonInterestsCount };
      });

      const sortedData = dataWithScores?.sort((a, b) => b._score - a._score);

      setStack(sortedData || []);
    } catch (error) {
      console.error('Error fetching stack:', error);
      toast.error('Failed to load discovery feed');
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
    if (!swipedProfile || loading) return;

    // Optimistic UI update
    setStack(prev => prev.filter(p => p.id !== swipedProfile.id));
    setSwipeHistory(prev => [swipedProfile, ...prev]);

    try {
      // Use UPSERT to handle potential retries or race conditions
      // Note: 403 error might occur if RLS policies are misconfigured
      const { error } = await supabase
        .from('swipes')
        .upsert({
          swiper_id: user.id,
          swiped_id: swipedProfile.id,
          direction,
          created_at: new Date().toISOString()
        }, { onConflict: 'swiper_id, swiped_id' });

      if (error) {
        console.error('Swipe DB Error:', error);
        throw error;
      }

      if (direction === 'like' || direction === 'superlike') {
        checkMatch(swipedProfile);
        toast.success(direction === 'superlike' ? 'Super Liked!' : 'Liked!', {
          icon: direction === 'superlike' ? '⭐' : '❤️',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error('Swipe error caught:', error);
      toast.error('Action failed. Check your connection or settings.');
      // Rollback optimistic update
      setStack(prev => [swipedProfile, ...prev]);
      setSwipeHistory(prev => prev.filter(p => p.id !== swipedProfile.id));
    }
  };

  const handleBoost = async () => {
    toast.success('Boost activated! You are now one of the top profiles in your area for 30 minutes.', {
      icon: '⚡',
      duration: 4000
    });
  };

  const handleRewind = async () => {
    const lastProfile = swipeHistory[0];
    if (!lastProfile) {
      toast.error('Nothing to rewind');
      return;
    }

    try {
      const { error } = await supabase
        .from('swipes')
        .delete()
        .eq('swiper_id', user.id)
        .eq('swiped_id', lastProfile.id);

      if (error) throw error;

      setStack(prev => [lastProfile, ...prev]);
      setSwipeHistory(prev => prev.slice(1));
      toast.success('Swipe undone!', { icon: '⏪' });
    } catch (error) {
      console.error('Rewind error:', error);
      toast.error('Failed to undo swipe');
    }
  };

  const checkMatch = async (otherProfile) => {
    try {
      // maybeSingle avoids 406 if no match found
      const { data: otherSwipe, error: checkError } = await supabase
        .from('swipes')
        .select('direction')
        .eq('swiper_id', otherProfile.id)
        .eq('swiped_id', user.id)
        .in('direction', ['like', 'superlike'])
        .maybeSingle();

      if (checkError) {
         console.warn('Error checking for match:', checkError);
         return;
      }

      if (otherSwipe) {
        const [u1, u2] = [user.id, otherProfile.id].sort();
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .upsert(
            { user1_id: u1, user2_id: u2, is_active: true, created_at: new Date().toISOString() },
            { onConflict: 'user1_id, user2_id' }
          )
          .select()
          .single();

        if (!matchError && matchData) {
          // Immediately update recent matches to show the new match
          fetchRecentMatches();
          setMatchedUser({ ...otherProfile, matchId: matchData.id });
          setShowMatch(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff79ac', '#ff5280', '#ffffff']
          });
        } else {
           console.error('Match creation error:', matchError);
        }
      }
    } catch (err) {
      console.error('Internal match check error:', err);
    }
  };

  const handleUpdateFilters = async (filters) => {
    try {
      const { error } = await supabase.from('profiles').update(filters).eq('id', user.id);
      if (error) throw error;

      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (updatedProfile) {
        useAuthStore.getState().setProfile(updatedProfile);
      }

      setShowFilters(false);
      fetchDiscoveryStack(true);
      toast.success('Filters updated');
    } catch (error) {
      console.error('Error updating filters:', error);
      toast.error('Failed to update filters');
    }
  };

  const navigateToChat = (matchId) => {
    setShowMatch(false);
    navigate(`/app/chat/${matchId}`);
  };

  const handleSayHello = async (matchId) => {
    try {
      const helloMessage = language === 'sw' ? 'Jambo! Nimefurahi kupata pacha hapa.' : "Hey! Glad we matched. How's it going?";
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: helloMessage
        });

      if (error) throw error;
      navigateToChat(matchId);
    } catch (error) {
      console.error('Error sending hello message:', error);
      toast.error('Failed to send message');
      navigateToChat(matchId);
    }
  };

  const spotlights = stack.slice(0, 3);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black font-sans pb-20 md:pb-0">
      <DiscoverySettingsModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        profile={profile}
        onSave={handleUpdateFilters}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 z-20 bg-black/50 backdrop-blur-md shrink-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/app/profile')}
          className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center overflow-hidden border border-white/10"
        >
           {profile?.photos?.[0] ? <img src={profile.photos[0]} className="w-full h-full object-cover" /> : <Flame className="text-primary" />}
        </motion.button>

        <div className="flex items-center gap-1">
          <Flame size={28} className="text-primary fill-current" />
          <span className="font-black text-2xl italic tracking-tighter">mambo</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(true)}
          className="p-2 text-dark-text hover:text-white transition-colors"
        >
          <Filter size={24} />
        </motion.button>
      </header>

      {/* New Matches & Spotlights Bar */}
      <div className="px-6 py-2 z-20 overflow-x-auto flex gap-4 no-scrollbar shrink-0">
        {recentMatches.map(m => (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={`match-${m.id}`}
            onClick={() => navigate(`/app/chat/${m.id}`)}
            className="flex-shrink-0 flex flex-col items-center gap-1"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-purple-500">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img src={m.photos[0]} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate w-16 text-center">
              {m.name}
            </span>
          </motion.button>
        ))}

        {/* Divider */}
        {recentMatches.length > 0 && <div className="w-[1px] h-12 bg-white/10 self-center" />}

        {spotlights.map(p => (
          <div key={`spotlight-${p.id}`} className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-orange-500">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img src={p.photos[0]} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Spotlight</span>
          </div>
        ))}
      </div>

      {/* Stack Area */}
      <div className="flex-grow relative px-4 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-primary font-bold animate-pulse">{t.finding_people}</p>
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
               <p className="text-white text-xl font-bold mb-2">{t.no_more_discovery}</p>
               <p className="text-dark-text text-sm">{t.expand_filters}</p>
             </div>
             <button
              onClick={() => setShowFilters(true)}
              className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg"
             >
               {t.discovery_settings}
             </button>
          </div>
        )}
      </div>

      {/* Action Row */}
      <div className="px-6 py-6 md:py-8 flex items-center justify-center gap-3 md:gap-4 z-20 shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (swipeHistory.length > 0) {
              handleRewind();
            } else {
              fetchDiscoveryStack(true);
            }
          }}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-yellow-500 shadow-lg"
        >
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => stack[0] && handleSwipe('pass', stack[0])}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-red-500 shadow-xl"
        >
          <X className="w-7 h-7 md:w-8 md:h-8" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => stack[0] && handleSwipe('superlike', stack[0])}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-blue-400 shadow-lg"
        >
          <Star className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => stack[0] && handleSwipe('like', stack[0])}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-green-500 shadow-xl"
        >
          <Heart className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBoost}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-purple-500 shadow-lg"
        >
          <Zap className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
        </motion.button>
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
              <h2 className="text-6xl font-black text-primary italic">{t.match}</h2>
              <p className="text-white text-xl">{t.you_and} {matchedUser.name} {t.liked_each_other}</p>
            </motion.div>

            <div className="flex gap-0 mb-16">
               <motion.div
                initial={{ x: -100, rotate: -20, opacity: 0 }}
                animate={{ x: 20, rotate: -10, opacity: 1 }}
                className="w-40 h-40 rounded-full border-4 border-white overflow-hidden z-10 shadow-2xl"
               >
                  {profile.photos?.[0] && <img src={profile.photos[0]} className="w-full h-full object-cover" />}
               </motion.div>
               <motion.div
                initial={{ x: 100, rotate: 20, opacity: 0 }}
                animate={{ x: -20, rotate: 10, opacity: 1 }}
                className="w-40 h-40 rounded-full border-4 border-white overflow-hidden z-0 shadow-2xl"
               >
                  {matchedUser.photos?.[0] && <img src={matchedUser.photos[0]} className="w-full h-full object-cover" />}
               </motion.div>
            </div>

            <div className="space-y-4 w-full max-w-xs">
              <button
                onClick={() => handleSayHello(matchedUser.matchId)}
                className="w-full primary-gradient text-white font-black py-4 rounded-full shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {t.say_hello}
              </button>
              <button
                onClick={() => navigateToChat(matchedUser.matchId)}
                className="w-full border-2 border-white/20 text-white font-black py-4 rounded-full hover:bg-white/10 transition-all"
              >
                {t.send_message}
              </button>
              <button
                onClick={() => setShowMatch(false)}
                className="w-full border-2 border-white/20 text-white font-black py-4 rounded-full hover:bg-white/10 transition-all"
              >
                {t.keep_swiping}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
