import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Smile
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const typingTimeoutRef = useRef(null);
  const channelRef = useRef(null);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close UI elements when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
      if (showMenu && !e.target.closest('.chat-menu-container')) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const markMessagesAsRead = useCallback(async () => {
    if (!matchId || !user?.id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    } catch (err) {
      console.warn('Error marking messages as read:', err);
    }
  }, [matchId, user?.id]);

  useEffect(() => {
    fetchMatchAndMessages();
    markMessagesAsRead();

    const channel = supabase
      .channel(`chat:${matchId}`, {
        config: { broadcast: { self: false } }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        if (payload.new.sender_id !== user.id) {
          markMessagesAsRead();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => prev.map(msg =>
          msg.id === payload.new.id ? payload.new : msg
        ));
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== user.id) {
          setOtherUserTyping(payload.isTyping);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
        }
      });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [matchId, user.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

      const otherUser = matchData.user1?.id === user.id ? matchData.user2 : matchData.user1;
      if (!otherUser) {
        throw new Error('Other user profile not found or restricted');
      }
      setMatch({ ...matchData, otherUser });

      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(msgData || []);
    } catch (error) {
      console.error('Chat Sync Error:', error);
      toast.error('Failed to sync chat');
      navigate('/app/messages');
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping && channelRef.current) {
      setIsTyping(true);
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: true }
      });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: user.id, isTyping: false }
        });
      }
    }, 3000);
  };

  const handleUnmatch = async () => {
    if (!window.confirm(`Are you sure you want to unmatch with ${match?.otherUser.name}? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from('matches')
        .update({ is_active: false })
        .eq('id', matchId);

      if (error) throw error;
      toast.success('Unmatched successfully');
      navigate('/app/messages');
    } catch (error) {
      toast.error('Failed to unmatch');
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    try {
      setLoading(true);
      // Logic for reporting (saving to reports table)
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_id: match.otherUser.id,
          match_id: matchId,
          reason: reportReason,
          created_at: new Date().toISOString()
        });

      if (error) {
        // If reports table doesn't exist, we fallback to log and unmatch
        console.warn('Reports table may not exist, logging locally:', error);
      }

      await handleUnmatch(); // Auto-unmatch after reporting
      setShowReportModal(false);
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsTyping(false);
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user.id, isTyping: false }
      });
    }

    const content = newMessage.trim();
    setNewMessage('');
    setShowEmojiPicker(false);
    if (inputRef.current) inputRef.current.style.height = 'auto';

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

  const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    inputRef.current?.focus();
  };


  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-black overflow-hidden z-[60] font-sans h-[100dvh] w-full">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 border-b border-white/5 bg-black/60 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-snap-blue hover:text-white transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-3" onClick={() => navigate(`/app/profile/${match?.otherUser.id}`)}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10">
              <img
                src={match?.otherUser.photos?.[0] || '/default-avatar.png'}
                alt={match?.otherUser.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/default-avatar.png'; }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight leading-none text-white">{match?.otherUser.name}</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 relative chat-menu-container">
          <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Phone size={20} /></button>
          <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Video size={20} /></button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
              >
                <button
                  onClick={() => { setShowMenu(false); handleUnmatch(); }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-white/5 transition-colors"
                >
                  Unmatch
                </button>
                <button
                  onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-snap-red hover:bg-snap-red/5 transition-colors border-t border-white/5"
                >
                  Report Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Report Profile</h2>
              <p className="text-zinc-400 text-sm mb-6">Why are you reporting {match?.otherUser.name}? This will also unmatch you.</p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[120px] resize-none mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-4 rounded-full font-bold text-zinc-400 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="flex-1 py-4 rounded-full font-black uppercase tracking-widest bg-snap-red text-white shadow-lg shadow-snap-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
        {/* Chat Info Card */}
        <div className="flex flex-col items-center py-4 space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 ring-2 ring-white/5">
            <img 
              src={match?.otherUser.photos?.[0] || '/default-avatar.png'} 
              alt={match?.otherUser.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/default-avatar.png'; }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-base font-black uppercase tracking-widest text-white">{match?.otherUser.name}</h2>
            <p className="text-[10px] text-zinc-600 mt-0.5 uppercase tracking-wider">
              {match?.otherUser.interests?.slice(0, 3).join(' · ') || 'No interests listed'}
            </p>
          </div>
        </div>

        {/* Messages by Date */}
        {Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date} className="space-y-1">
            <div className="flex items-center justify-center py-3">
              <div className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
                {formatMessageDate(dayMessages[0].created_at)}
              </div>
            </div>

            {dayMessages.map((msg, i) => {
              const isOwn = msg.sender_id === user.id;
              const prevMsg = dayMessages[i - 1];
              const isFirstInGroup = !prevMsg || prevMsg.sender_id !== msg.sender_id;

              return (
                <div 
                  key={msg.id || i} 
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}
                >
                  <div className={`max-w-[80%] sm:max-w-[70%] relative group`}>
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      {isFirstInGroup && <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isOwn ? 'text-snap-blue' : 'text-snap-yellow'}`}>{isOwn ? 'Me' : match?.otherUser.name}</span>}
                      <div
                        className={`px-4 py-2 text-sm font-medium leading-relaxed tracking-tight whitespace-pre-wrap break-words border-l-2 ${
                          isOwn
                            ? 'bg-transparent text-white border-snap-blue'
                            : 'bg-transparent text-white border-snap-yellow'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                    <div className={`text-[10px] text-zinc-700 mt-0.5 ${isOwn ? 'text-right' : 'text-left'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      {formatMessageTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start mt-2">
            <div className="bg-zinc-900 text-zinc-400 px-4 py-2.5 rounded-[1.5rem] border border-white/5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-[88px] left-4 z-50">
          <div className="shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              width={320}
              height={380}
              lazyLoadEmojis={true}
              searchDisabled={false}
              skinTonesDisabled={false}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <footer className="flex-shrink-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent relative z-40 pb-safe">
        <form 
          onSubmit={handleSendMessage} 
          className="max-w-4xl mx-auto flex gap-2 items-end bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-2 rounded-[2rem]"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              showEmojiPicker 
                ? 'text-yellow-400 bg-white/10' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smile size={20} />
          </button>

          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              handleTyping(e);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
            }}
            onFocus={() => setShowEmojiPicker(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Initialize response..."
            rows={1}
            className="flex-1 bg-transparent border-none px-2 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 resize-none max-h-[160px] leading-relaxed whitespace-pre-wrap break-words"
          />


          {/* Send button */}
          {newMessage.trim() && (
            <button
              type="submit"
              className="flex-shrink-0 w-12 h-12 rounded-full bg-snap-blue text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-snap-blue/20"
            >
              <Send size={18} strokeWidth={3} />
            </button>
          )}
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
