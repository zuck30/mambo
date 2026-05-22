import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';
import { supabase } from '../../lib/supabase';
import { 
  ChevronLeft, LogOut, Trash2, Bell, Shield, Phone, 
  Flame, Globe, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { profile, signOut, fetchProfile } = useAuth();
  const { language, setLanguage } = useAuthStore();
  const t = translations[language];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '');
  const [expandedSection, setExpandedSection] = useState(null);

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ phone_number: phoneNumber })
        .eq('id', profile.id);
      if (error) throw error;
      await fetchProfile(profile.id);
      setIsEditingPhone(false);
      toast.success('Phone updated');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Delete account permanently?')) {
      setLoading(true);
      try {
        await supabase.from('profiles').delete().eq('id', profile.id);
        await signOut();
        navigate('/login');
      } catch (error) {
        toast.error('Action failed. Contact support.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 h-16 px-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight">{t.settings}</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-8">
        
        {/* Language Selection */}
        <section>
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 mb-3 block">My Preferences</label>
          <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Globe size={20} />
              </div>
              <span className="font-bold text-sm">App Language</span>
            </div>
            <div className="flex bg-black p-1 rounded-xl border border-white/5">
              {['en', 'sw'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    language === lang ? 'bg-white text-black shadow-xl' : 'text-zinc-500'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 block">Account Settings</label>
          <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden shadow-2xl">
            
            {/* Phone Number Item */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Phone size={18} />
                  </div>
                  <span className="font-bold text-sm text-white">{t.phone_number}</span>
                </div>
                <button 
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className="text-[10px] font-black uppercase text-theme-yellow tracking-wider"
                >
                  {isEditingPhone ? t.cancel : 'Change'}
                </button>
              </div>
              
              {isEditingPhone ? (
                <div className="flex gap-2 mt-4">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-grow bg-black border border-white/10 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-theme-yellow/50 text-white"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-theme-yellow text-black px-5 rounded-xl font-bold text-xs uppercase disabled:opacity-50 shadow-lg"
                  >
                    {loading ? '...' : t.save}
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm ml-14 font-medium">{profile?.phone_number || 'Not linked'}</p>
              )}
            </div>

            {/* Notification Toggle */}
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Bell size={18} />
                </div>
                <span className="font-bold text-sm text-white">Notifications</span>
              </div>
              <div className="w-12 h-7 bg-zinc-800 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </section>


        {/* Actions */}
        <div className="pt-6 space-y-3">
          <button
            onClick={signOut}
            className="w-full bg-zinc-900/40 border border-white/5 text-white font-black uppercase text-xs tracking-widest h-16 rounded-full flex items-center justify-center gap-3 hover:bg-white/5 transition-all shadow-xl"
          >
            <LogOut size={20} /> {t.logout}
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full text-theme-red font-black uppercase text-xs tracking-[0.2em] h-16 flex items-center justify-center gap-2 hover:bg-theme-red/5 rounded-full transition-all"
          >
            <Trash2 size={18} /> {t.delete_account}
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center pt-10 opacity-20">
           <Flame className="mx-auto text-white mb-3" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;