import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ChevronLeft, Send, Phone, Video, Sparkles, MoreVertical } from 'lucide-react';
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
          user1:profiles!user1_id(id, name, photos, interests),
          user2:profiles!user2_id(id, name, photos, interests)
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
      toast.error('Failed to sync chat');
      navigate('/app/messages');
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
      toast.error('Message delivery failed');
      setNewMessage(content);
    }
  };

  const handleAiIcebreaker = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('oa-ai', {
        body: {
          prompt: 'Generate a high-engagement technical icebreaker.',
          context: `Match: ${match?.otherUser.name}. Interests: ${match?.otherUser.interests?.join(', ')}.`
        }
      });
      if (error) throw error;
      setNewMessage(data.response);
    } catch (error) {
      toast.error('Intelligence service unavailable');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden fixed inset-0 z-[60] font-sans">
      {/* Precision Header */}
      <header className="flex items-center gap-4 px-6 h-20 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-3 flex-grow">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/10 ring-2 ring-white/5">
            <img src={match?.otherUser.photos[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest italic">{match?.otherUser.name}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 text-zinc-500 hover:text-white transition-colors"><Phone size={18} /></button>
          <button className="p-3 text-zinc-500 hover:text-white transition-colors"><Video size={18} /></button>
          <button className="p-3 text-zinc-500 hover:text-white transition-colors"><MoreVertical size={18} /></button>
        </div>
      </header>

      {/* Message Stream */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => {
          const isOwn = msg.sender_id === user.id;
          return (
            <div key={msg.id || i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-5 py-3 text-sm font-medium leading-relaxed tracking-tight ${
                  isOwn
                    ? 'bg-white text-black rounded-[1.5rem] rounded-br-none shadow-xl shadow-white/5'
                    : 'bg-zinc-900 text-zinc-200 border border-white/5 rounded-[1.5rem] rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* High-End Input Console */}
      <footer className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
        <form 
          onSubmit={handleSendMessage} 
          className="max-w-4xl mx-auto flex gap-3 items-center bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-2 rounded-[2rem]"
        >
          <button
            type="button"
            onClick={handleAiIcebreaker}
            disabled={aiLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              aiLoading ? 'bg-white/5 text-white animate-pulse' : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={20} className={aiLoading ? 'fill-current' : ''} />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Initialize response..."
            className="flex-grow bg-transparent border-none px-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Send size={18} className="fill-current" />
          </button>
        </form>
        {/* Safe Area Spacer */}
        <div className="h-safe-bottom" />
      </footer>
    </div>
  );
};

export default ChatPage;