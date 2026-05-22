import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Search, MessageCircle } from 'lucide-react';

const MessagesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          created_at,
          is_active,
          user1:profiles!user1_id(id, name, photos),
          user2:profiles!user2_id(id, name, photos),
          messages(content, created_at, is_read, sender_id)
        `)
        .eq('is_active', true)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .order('created_at', { ascending: false, referencedTable: 'messages' });

      if (error) throw error;

      const formattedMatches = data.map(m => {
        const otherUser = m.user1.id === user.id ? m.user2 : m.user1;
        // messages are now newest-first, so index 0 is the latest
        const lastMessage = m.messages?.length > 0 ? m.messages[0] : null;
        return {
          id: m.id,
          otherUser,
          lastMessage,
          createdAt: m.created_at
        };
      });

      // Sort by last message time (or match created_at if no messages)
      formattedMatches.sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.created_at) : new Date(a.createdAt);
        const bTime = b.lastMessage ? new Date(b.lastMessage.created_at) : new Date(b.createdAt);
        return bTime - aTime;
      });

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(m =>
    m.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 pb-32">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
        </div>
        <h1 className="text-xl font-black tracking-tight">Chat</h1>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-600">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Jump to chat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-xs font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="space-y-3">
          {filteredMatches.map(m => (
            <Link
              key={m.id}
              to={`/app/chat/${m.id}`}
              className="flex items-center gap-5 p-4 bg-zinc-900/30 border border-white/5 rounded-[2rem] hover:bg-zinc-900/60 transition-all active:scale-[0.98] group"
            >
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/10 group-hover:border-theme-blue transition-colors">
              <img src={m.otherUser.photos[0]} alt="" className="w-full h-full object-cover" />
            </div>
              </div>
              <div className="flex-grow min-w-0 py-1">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-lg tracking-tight truncate">{m.otherUser.name}</h3>
                  <span className="text-[10px] font-bold text-zinc-600 flex-shrink-0 ml-2 uppercase">
                    {m.lastMessage
                      ? formatDistanceToNow(new Date(m.lastMessage.created_at), { addSuffix: false })
                      : 'Just now'}
                  </span>
                </div>
            <div className="flex items-center gap-2">
              {m.lastMessage && !m.lastMessage.is_read && m.lastMessage.sender_id !== user.id ? (
                <div className="w-3 h-3 bg-theme-blue rounded-[2px]" />
              ) : (
                <div className="w-3 h-3 border-2 border-theme-blue rounded-[2px]" />
              )}
              <p className={`text-xs truncate ${m.lastMessage && !m.lastMessage.is_read && m.lastMessage.sender_id !== user.id ? 'text-theme-blue font-bold' : 'text-zinc-500'}`}>
                    {m.lastMessage
                  ? (m.lastMessage.sender_id === user.id ? 'Delivered' : m.lastMessage.content)
                  : 'New Friend'}
                <span className="mx-1">·</span>
                {m.lastMessage
                  ? formatDistanceToNow(new Date(m.lastMessage.created_at), { addSuffix: false })
                  : 'Just now'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-dark-text">
          <p className="text-lg">No matches yet.</p>
          <p className="text-sm">Start swiping to find someone special!</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;