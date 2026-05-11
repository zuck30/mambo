import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const MessagesPage = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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
          user1:profiles!user1_id(id, name, photos),
          user2:profiles!user2_id(id, name, photos),
          messages(content, created_at, is_read, sender_id)
        `)
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-black mb-6">Messages</h1>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-dark-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map(m => (
            <Link
              key={m.id}
              to={`/app/chat/${m.id}`}
              className="flex items-center gap-4 p-4 bg-dark-card rounded-2xl hover:bg-dark-surface transition-colors"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img src={m.otherUser.photos[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-lg truncate">{m.otherUser.name}</h3>
                  <span className="text-xs text-dark-text flex-shrink-0 ml-2">
                    {m.lastMessage
                      ? formatDistanceToNow(new Date(m.lastMessage.created_at), { addSuffix: true })
                      : formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-dark-text text-sm truncate">
                  {m.lastMessage
                    ? (m.lastMessage.sender_id === user.id ? 'You: ' : '') + m.lastMessage.content
                    : 'New match! Say hello 👋'}
                </p>
              </div>
              {m.lastMessage && !m.lastMessage.is_read && m.lastMessage.sender_id !== user.id && (
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0" />
              )}
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