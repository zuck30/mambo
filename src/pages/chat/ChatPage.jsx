import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ChevronLeft, Send, Phone, Video, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    fetchMatchAndMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMatchAndMessages = async () => {
    try {
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select(`
          id,
          user1:profiles!matches_user1_id_fkey(id, name, photos),
          user2:profiles!matches_user2_id_fkey(id, name, photos)
        `)
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;

      const otherUser = matchData.user1.id === user.id ? matchData.user2 : matchData.user1;
      setMatch({ ...matchData, otherUser });

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgData || []);
    } catch (error) {
      toast.error('Failed to load chat');
      navigate('/messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(content);
    }
  };

  const handleAiIcebreaker = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('oa-ai', {
        body: {
          prompt: 'Give me a creative icebreaker for this person.',
          context: `Matched with ${match?.otherUser.name}. They are into ${match?.otherUser.interests.join(', ')}.`
        }
      });
      if (error) throw error;
      setNewMessage(data.response);
    } catch (error) {
      toast.error('AI assistant is busy right now');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-dark overflow-hidden fixed inset-0 z-[60]">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 h-16 border-b border-white/5 bg-dark-card">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-text">
          <ChevronLeft size={28} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img src={match?.otherUser.photos[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold">{match?.otherUser.name}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <div className="flex gap-2 text-primary">
          <button className="p-2"><Phone size={20} /></button>
          <button className="p-2"><Video size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isOwn = msg.sender_id === user.id;
          return (
            <div key={msg.id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  isOwn
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-surface text-white rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-dark-card border-t border-white/5">
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={handleAiIcebreaker}
            disabled={aiLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${aiLoading ? 'text-primary animate-pulse' : 'text-dark-text hover:text-primary'}`}
            title="Get AI Icebreaker"
          >
            <Sparkles size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-dark-surface border border-white/10 rounded-full px-4 py-2 text-white focus:outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
