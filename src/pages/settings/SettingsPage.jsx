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
    <div className="min-h-screen bg-[#F0F1F2] text-black font-sans antialiased pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 h-16 px-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-black transition-colors">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight">{t.settings}</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-8">
        
        {/* Language Selection */}
        <section>
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2 mb-3 block">My Preferences</label>
          <div className="bg-white border border-zinc-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                <Globe size={20} />
              </div>
              <span className="font-bold text-sm">App Language</span>
            </div>
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              {['en', 'sw'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    language === lang ? 'bg-white text-black shadow-sm' : 'text-zinc-400'
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
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2 block">Account Settings</label>
          <div className="bg-white border border-zinc-100 rounded-[2rem] divide-y divide-zinc-50 overflow-hidden shadow-sm">
            
            {/* Phone Number Item */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
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
                    className="flex-grow bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-snap-yellow/50"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-snap-yellow text-black px-5 rounded-xl font-bold text-xs uppercase disabled:opacity-50 shadow-sm"
                  >
                    {loading ? '...' : t.save}
                  </button>
                </div>
              ) : (
                <p className="text-zinc-400 text-sm ml-14 font-medium">{profile?.phone_number || 'Not linked'}</p>
              )}
            </div>

            {/* Notification Toggle */}
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                  <Bell size={18} />
                </div>
                <span className="font-bold text-sm">Notifications</span>
              </div>
              <div className="w-12 h-7 bg-zinc-100 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="space-y-4">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-2 block">Support</label>
          <div className="bg-white border border-zinc-100 rounded-[2rem] overflow-hidden shadow-sm">
            {[
              { id: 'safety', label: 'Safety Center', icon: Shield },
              { id: 'terms', label: 'Terms of Service', icon: AlertTriangle }
            ].map((item) => (
              <button
                key={item.id}
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400">
                    <item.icon size={18} />
                  </div>
                  <span className="font-bold text-sm text-zinc-800">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6 space-y-3">
          <button
            onClick={signOut}
            className="w-full bg-white border border-zinc-100 text-black font-black uppercase text-xs tracking-widest h-16 rounded-full flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all shadow-sm"
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
        <div className="text-center pt-10 opacity-10">
           <Flame className="mx-auto text-black mb-3" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;