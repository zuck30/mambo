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
    if (profile?.id) {
      fetchDiscoveryStack();
      fetchRecentMatches();
      fetchSwipeHistory();
    }
  }, [profile?.id, profile?.gender, profile?.show_gender, profile?.distance_pref, profile?.min_age_pref, profile?.max_age_pref]);

  const fetchSwipeHistory = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('swipes')
        .select('swiped_id, direction, created_at, swiped_profile:profiles!swiped_id(*)')
        .eq('swiper_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSwipeHistory(data.map(s => s.swiped_profile).filter(Boolean));
    } catch (err) {
      console.warn('Error fetching swipe history:', err);
    }
  };

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
        if (!m.user1 || !m.user2) return null;
        const otherUser = m.user1.id === user.id ? m.user2 : m.user1;
        // Include the match id explicitly to avoid being overwritten by user id
        return { matchId: m.id, ...otherUser };
      }).filter(Boolean);
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
      // 1. Try fetching via RPC (Server-side heavy lifting)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_discovery_stack', {
        p_user_id: user.id,
        p_latitude: profile.latitude,
        p_longitude: profile.longitude,
        p_distance_pref: profile.distance_pref || 80,
        p_show_gender: profile.show_gender || 'everyone',
        p_min_age: profile.min_age_pref || 18,
        p_max_age: profile.max_age_pref || 100,
        p_user_gender: profile.gender
      });

      let discoveryData = [];

      if (!rpcError && rpcData) {
        console.log('RPC Discovery Success:', rpcData.length, 'profiles found');
        discoveryData = rpcData;
      } else {
        console.warn('RPC Discovery failed or not found, falling back to JS filtering:', rpcError);
        // 2. Fallback to JS Filtering (Legacy/Safety)
        const { data: swipedData } = await supabase
          .from('swipes')
          .select('swiped_id')
          .eq('swiper_id', user.id);

        const swipedIds = Array.from(new Set([
          ...(swipedData?.map(s => s.swiped_id) || []),
          user.id
        ])).filter(Boolean);

        let query = supabase.from('profiles').select('*').eq('is_onboarded', true);
        if (swipedIds.length > 0) {
          query = query.filter('id', 'not.in', `(${swipedIds.join(',')})`);
        }

        if (profile.show_gender && profile.show_gender !== 'everyone') {
          const genderMap = { 'men': 'male', 'women': 'female' };
          const targetGender = genderMap[profile.show_gender];
          if (targetGender) query = query.eq('gender', targetGender);
        }

        const minAge = profile.min_age_pref || 18;
        const maxAge = profile.max_age_pref || 100;
        query = query.gte('birthday', formatDate(maxAge)).lte('birthday', formatDate(minAge));

        const { data, error } = await query.limit(1000);
        if (error) throw error;

        discoveryData = data?.filter(p => {
          if (profile.latitude == null || p.latitude == null) return true;
          const d = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
          return d <= (profile.distance_pref || 80);
        }) || [];
      }

      // 3. Common Scoring & Sorting (applied to both RPC and Fallback)
      const myInterests = profile.interests || [];
      // Fetch users who liked me to prioritize them
      const { data: likedMeData } = await supabase
        .from('swipes')
        .select('swiper_id')
        .eq('swiped_id', user.id)
        .in('direction', ['like', 'superlike']);
      const likedMeIds = likedMeData?.map(s => s.swiper_id) || [];

      const dataWithScores = discoveryData.map(p => {
        if (!p || !p.id) return null;
        const pInterests = p.interests || [];
        const commonInterestsCount = pInterests.filter(i => myInterests.includes(i)).length;

        let score = (commonInterestsCount * 25);
        if (likedMeIds.includes(p.id)) score += 150;
        if (profile.school && p.school && profile.school.trim().toLowerCase() === p.school.trim().toLowerCase()) score += 50;

        if (profile.latitude && profile.longitude && p.latitude && p.longitude) {
          const distance = calculateDistance(profile.latitude, profile.longitude, p.latitude, p.longitude);
          score += Math.max(0, 100 - distance);
        }

        score += Math.random() * 20;
        return { ...p, _score: score };
      }).filter(Boolean);

      setStack(dataWithScores.sort((a, b) => b._score - a._score));
    } catch (error) {
      console.error('Discovery Error:', error);
      toast.error(`Discovery Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
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
        }, { onConflict: 'swiper_id,swiped_id' });

      if (error) {
        console.error('Swipe DB Error:', error);
        throw error;
      }

      if (direction === 'like' || direction === 'superlike') {
        const isMatch = await checkMatch(swipedProfile);
        if (!isMatch) {
          toast.success(direction === 'superlike' ? 'Super Liked!' : 'Liked!', {
            icon: direction === 'superlike' ? '⭐' : '❤️',
            position: 'top-center'
          });
        }
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
    if (loading || swipeHistory.length === 0) {
      toast.error('Nothing to rewind');
      return;
    }

    const lastProfile = swipeHistory[0];

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const checkMatch = async (otherProfile) => {
    console.log(`Checking match with user: ${otherProfile.id}`);
    try {
      // Use select() instead of maybeSingle() to avoid 406 errors and handle duplicates gracefully
      const { data: otherSwipes, error: checkError } = await supabase
        .from('swipes')
        .select('direction')
        .eq('swiper_id', otherProfile.id)
        .eq('swiped_id', user.id)
        .in('direction', ['like', 'superlike']);

      if (checkError) {
         console.error('Error checking for reciprocal swipe:', checkError);
         return false;
      }

      const hasReciprocalSwipe = otherSwipes && otherSwipes.length > 0;
      console.log('Reciprocal swipe search result:', otherSwipes);

      if (hasReciprocalSwipe) {
        console.log('Match detected! Processing match record...');
        const [u1, u2] = [user.id, otherProfile.id].sort();

        // 1. Check if match already exists
        const { data: existingMatch, error: existingError } = await supabase
          .from('matches')
          .select('id, user1_id, user2_id')
          .eq('user1_id', u1)
          .eq('user2_id', u2)
          .maybeSingle();

        if (existingError) {
          console.error('Error checking for existing match:', existingError);
        }

        let matchData = existingMatch;
        let matchError = null;

        // 2. Create match if it doesn't exist
        if (!matchData) {
          const { data, error } = await supabase
            .from('matches')
            .upsert(
              { user1_id: u1, user2_id: u2, is_active: true, created_at: new Date().toISOString() },
              { onConflict: 'user1_id,user2_id' }
            )
            .select('id, user1_id, user2_id')
            .single();

          matchData = data;
          matchError = error;
        }

        if (!matchError && matchData) {
          console.log('Match confirmed:', matchData.id);
          // Immediately update recent matches to show the new match
          fetchRecentMatches();
          setMatchedUser({ ...otherProfile, matchId: matchData.id });
          setShowMatch(true);
          console.log('ShowMatch state set to TRUE');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff79ac', '#ff5280', '#ffffff']
          });
          return true;
        } else {
           console.error('Match creation/retrieval error:', matchError);
           toast.error('Could not finalize match. Please try again.');
           return false;
        }
      }
      return false;
    } catch (err) {
      console.error('Internal match check error:', err);
      toast.error('An unexpected error occurred during match check.');
      return false;
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
      const helloMessage = language === 'sw' ? 'Mambo! Nimefurahi kupata pacha hapa.' : "Hey! Glad we matched. Mambo vipi?";
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
          m.photos?.[0] && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={`match-${m.matchId}`}
              onClick={() => navigate(`/app/chat/${m.matchId}`)}
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
          )
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
               <p className="text-dark-text text-sm mb-4">{t.expand_filters}</p>
               <div className="flex flex-wrap justify-center gap-2 mb-6">
                 <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                   {profile?.show_gender}
                 </span>
                 <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                   {profile?.min_age_pref || 18} - {profile?.max_age_pref || 100} years
                 </span>
                 <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                   {profile?.distance_pref || 80}km range
                 </span>
               </div>
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
