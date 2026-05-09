import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, LogOut, Trash2, Bell, Shield, Phone , Flame, Globe} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { profile, signOut, fetchProfile } = useAuth();
  const { language, setLanguage } = useAuthStore();
  const t = translations[language];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '');

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ phone: phoneNumber })
        .eq('id', profile.id);
      if (error) throw error;
      await fetchProfile(profile.id);
      setIsEditingPhone(false);
      toast.success('Phone number updated');
    } catch (error) {
      toast.error('Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      setLoading(true);
      try {
        // Delete all related records first to avoid FK constraints
        await supabase.from('messages').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
        await supabase.from('matches').delete().or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`);
        await supabase.from('swipes').delete().or(`swiper_id.eq.${profile.id},swiped_id.eq.${profile.id}`);

        const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
        if (error) throw error;

        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete account. Please contact support.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark pb-20">
      <div className="flex items-center gap-4 px-6 h-16 border-b border-white/5 bg-dark-card sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-text">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-black">{t.settings}</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Language Settings */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">{t.language}</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-dark-text" />
                <span>{t.language}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${language === 'en' ? 'bg-primary text-white' : 'bg-dark-surface text-dark-text'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('sw')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${language === 'sw' ? 'bg-primary text-white' : 'bg-dark-surface text-dark-text'}`}
                >
                  SW
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">Account Settings</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-dark-text" />
                  <span>{t.phone_number}</span>
                </div>
                <button
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className="text-primary font-bold text-sm"
                >
                  {isEditingPhone ? t.cancel : (profile?.phone ? 'Edit' : 'Add')}
                </button>
              </div>

              {isEditingPhone ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-grow bg-dark-surface border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    {t.save}
                  </button>
                </div>
              ) : (
                <span className="text-dark-text ml-8 block">{profile?.phone || 'Not set'}</span>
              )}
            </div>
            <button className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-dark-text" />
                <span>{t.notifications}</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </button>
            <button className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-dark-text" />
                <span>{t.privacy_safety}</span>
              </div>
            </button>
          </div>
        </section>

        {/* Support */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">Legal</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <button className="w-full p-4 text-left hover:bg-white/5 transition-colors">Privacy Policy</button>
            <button className="w-full p-4 text-left hover:bg-white/5 transition-colors">Terms of Service</button>
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button
            onClick={signOut}
            className="w-full bg-dark-card text-white font-bold py-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            <LogOut size={20} /> {t.logout}
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full text-red-500 font-bold py-4 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> {t.delete_account}
          </button>
        </div>

        <div className="text-center py-8">
           <Flame className="mx-auto text-primary opacity-20 mb-2" size={32} />
           <p className="text-xs text-dark-text font-bold uppercase tracking-widest">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
