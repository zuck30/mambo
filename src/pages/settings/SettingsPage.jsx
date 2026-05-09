import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, LogOut, Trash2, Bell, Shield, Phone , Flame} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      setLoading(true);
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
        if (error) throw error;
        await signOut();
        navigate('/login');
      } catch (error) {
        toast.error('Failed to delete account');
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
        <h1 className="text-xl font-black">Settings</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Account Settings */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">Account Settings</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-dark-text" />
                <span>Phone Number</span>
              </div>
              <span className="text-dark-text">{profile?.phone || 'Not set'}</span>
            </div>
            <button className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-dark-text" />
                <span>Notifications</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </button>
            <button className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-dark-text" />
                <span>Privacy & Safety</span>
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
            <LogOut size={20} /> Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full text-red-500 font-bold py-4 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> Delete Account
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
