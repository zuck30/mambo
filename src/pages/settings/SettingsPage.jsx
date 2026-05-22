import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';
import { supabase } from '../../lib/supabase';
import { 
  ChevronLeft, LogOut, Trash2, Bell, Shield, Phone, 
  Flame, Globe, ChevronRight, Lock, Eye, AlertTriangle 
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
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 px-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">{t.settings}</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-10">
        
        {/* Language Selection */}
        <section>
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1 mb-4 block">Preference</label>
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex items-center justify-between">
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
                    language === lang ? 'bg-white text-black shadow-lg' : 'text-zinc-500'
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
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 block">Account Settings</label>
          <div className="bg-black/20 border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden">
            
            {/* Phone Number Item */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <Phone size={18} />
                  </div>
                  <span className="font-bold text-sm">{t.phone_number}</span>
                </div>
                <button 
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className="text-[10px] font-black uppercase text-snap-yellow tracking-wider"
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
                    className="flex-grow bg-black border border-white/10 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-snap-yellow/50"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-snap-yellow text-black px-5 rounded-xl font-bold text-xs uppercase disabled:opacity-50"
                  >
                    {loading ? '...' : t.save}
                  </button>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm ml-14">{profile?.phone_number || 'Not linked'}</p>
              )}
            </div>

            {/* Notification Toggle */}
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Bell size={18} />
                </div>
                <span className="font-bold text-sm">Notifications</span>
              </div>
              <div className="w-12 h-7 bg-zinc-800 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Legal */}
        <section className="space-y-4">
          <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 block">Privacy & Support</label>
          <div className="bg-black/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
            {[
              { id: 'safety', label: 'Safety Center', icon: Shield },
              { id: 'privacy', label: 'Privacy Policy', icon: Lock },
              { id: 'terms', label: 'Terms of Service', icon: AlertTriangle }
            ].map((item) => (
              <button
                key={item.id}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <item.icon size={18} />
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-zinc-600 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6 space-y-3">
          <button
            onClick={signOut}
            className="w-full bg-black/20 border border-white/5 text-white font-black uppercase text-xs tracking-widest h-16 rounded-full flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
          >
            <LogOut size={20} /> {t.logout}
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full text-snap-red font-black uppercase text-xs tracking-[0.2em] h-16 flex items-center justify-center gap-2 hover:bg-snap-red/5 rounded-full transition-all"
          >
            <Trash2 size={18} /> {t.delete_account}
          </button>
        </div>

        {/* Version Info */}
        <div className="text-center pt-10 opacity-20">
           <Flame className="mx-auto text-primary mb-3" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;