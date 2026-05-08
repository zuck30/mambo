import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Settings, Edit2, Shield, CreditCard, ChevronRight } from 'lucide-react';
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

        <div className="flex gap-4 mt-8">
           <button
             onClick={() => navigate('/settings')}
             className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-dark-text hover:text-white"
           >
             <Settings size={20} />
           </button>
           <button
             onClick={() => navigate('/profile/edit')}
             className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold flex items-center gap-2"
           >
             <Edit2 size={18} /> Edit Profile
           </button>
           <button className="w-12 h-12 rounded-full bg-dark-card border border-white/5 flex items-center justify-center text-dark-text hover:text-white">
             <Shield size={20} />
           </button>
        </div>
      </div>

      {/* Stats/Subscription */}
      <div className="px-6 grid grid-cols-3 gap-4 mb-8">
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-primary font-bold text-xl">{profile?.swipes_remaining || 0}</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Swipes Left</span>
         </div>
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-blue-400 font-bold text-xl">{profile?.super_likes_remaining || 0}</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Super Likes</span>
         </div>
         <div className="bg-dark-card p-4 rounded-2xl border border-white/5 text-center">
            <span className="block text-purple-400 font-bold text-xl">0</span>
            <span className="text-[10px] text-dark-text uppercase font-bold tracking-wider">Boosts</span>
         </div>
      </div>

      {/* Subscription Banner */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 rounded-2xl text-dark-card">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-black text-xl">Get Oa Gold</h3>
             <CreditCard size={24} />
           </div>
           <p className="text-sm font-medium mb-4">See who likes you & more!</p>
           <button className="w-full bg-dark-card text-white py-2 rounded-full font-bold text-sm">
             Upgrade from $9.99
           </button>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="px-6 space-y-2">
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
