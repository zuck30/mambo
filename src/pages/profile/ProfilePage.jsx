import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Settings, Edit2, Shield, CreditCard, ChevronRight, ShieldCheck, Crown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-20">
      <div className="max-w-2xl mx-auto">
        
        {/* Header/Cover Area */}
        <div className="relative pt-12 pb-8 px-6 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-primary to-rose-500">
              <div className="w-full h-full rounded-full border-4 border-black overflow-hidden bg-zinc-900">
                <img 
                  src={profile?.photos?.[0] || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <h2 className="text-3xl font-black tracking-tight">
              {profile?.name}{profile?.birthday && `, ${calculateAge(profile.birthday)}`}
            </h2>
            <p className="text-zinc-400 font-medium">{profile?.job || 'Add Job Title'}</p>
            {profile?.school && <p className="text-zinc-500 text-sm">{profile.school}</p>}
          </div>

          {/* Core Actions */}
          <div className="flex items-center gap-4 mt-8 w-full max-w-sm">
            <button 
              onClick={() => navigate('/app/settings')}
              className="flex-1 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Settings size={20} className="mr-2" />
              <span className="font-bold text-sm">Settings</span>
            </button>
            <button 
              onClick={() => navigate('/app/profile/edit')}
              className="flex-[2] h-12 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              <Edit2 size={18} className="mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-[2rem] text-black shadow-xl shadow-orange-500/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-black leading-none uppercase italic">Premium</h3>
                <p className="text-xs font-bold opacity-80 mt-1">SEE WHO LIKES YOU & MORE</p>
              </div>
              <Crown size={28} />
            </div>
            <button className="w-full bg-black text-white h-11 rounded-xl font-bold text-sm">
              Upgrade from 5,000 TZS
            </button>
          </div>

          {/* Bio Section */}
          {profile?.bio && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1">About Me</h4>
              <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-3xl text-zinc-200 leading-relaxed">
                {profile.bio}
              </div>
            </div>
          )}

          {/* Secondary Menu */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden">
            {profile?.role === 'admin' && (
              <button 
                onClick={() => navigate('/app/admin')}
                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5 text-primary"
              >
                <div className="flex items-center gap-4">
                  <ShieldCheck size={20} />
                  <span className="font-bold text-sm">Admin Dashboard</span>
                </div>
                <ChevronRight size={18} />
              </button>
            )}
            <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5 text-zinc-300">
              <div className="flex items-center gap-4">
                <Shield size={20} />
                <span className="font-bold text-sm">Safety Center</span>
              </div>
              <ChevronRight size={18} />
            </button>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-4 p-5 text-rose-500 hover:bg-rose-500/5 transition-colors font-bold text-sm"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;