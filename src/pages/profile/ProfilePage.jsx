import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Settings, Edit2, Shield, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="flex flex-col h-full bg-dark overflow-y-auto pb-10">
      {/* Profile Header */}
      <div className="relative h-[40vh] flex flex-col items-center justify-center pt-10">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-dark">
          <div className="w-full h-full rounded-full border-4 border-dark overflow-hidden">
             <img
               src={profile?.photos?.[0] || 'https://via.placeholder.com/150'}
               className="w-full h-full object-cover"
               alt=""
             />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">
          {profile?.name}, {calculateAge(profile?.birthday)}
        </h2>
        <p className="text-dark-text">{profile?.job || 'Add job title'}</p>
        {profile?.school && <p className="text-dark-text text-sm">{profile.school}</p>}

        <div className="flex gap-4 mt-8">
           <button
             onClick={() => navigate('/app/settings')}
             className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-dark-text hover:text-white"
           >
             <Settings size={20} />
           </button>
           <button
             onClick={() => navigate('/app/profile/edit')}
             className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold flex items-center gap-2"
           >
             <Edit2 size={18} /> Edit Profile
           </button>
           <button className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-dark-text hover:text-white">
             <Shield size={20} />
           </button>
        </div>
      </div>

      {/* Bio Section */}
      {profile?.bio && (
        <div className="px-6 mb-8">
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-2">About Me</h3>
          <p className="text-white bg-dark-card p-4 rounded-2xl border border-white/5">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Stats Section */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-8">
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-primary font-bold text-xl">∞</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Swipes</span>
         </div>
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-blue-400 font-bold text-xl">∞</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Super Likes</span>
         </div>
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-purple-400 font-bold text-xl">∞</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Boosts</span>
         </div>
      </div>

      {/* Quick Menu */}
      <div className="px-6 space-y-2">
        {profile?.role === 'admin' && (
          <button
            onClick={() => navigate('/app/admin')}
            className="w-full flex justify-between items-center p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary"
          >
             <div className="flex items-center gap-3">
               <ShieldCheck size={20} />
               <span className="font-bold">Admin Dashboard</span>
             </div>
             <ChevronRight size={20} />
          </button>
        )}
        <button className="w-full flex justify-between items-center p-4 bg-dark-card rounded-2xl border border-white/5">
           <span className="font-bold">Discovery Settings</span>
           <ChevronRight size={20} className="text-dark-text" />
        </button>
        <button
          onClick={signOut}
          className="w-full p-4 bg-dark-card rounded-2xl border border-white/5 text-red-500 font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
