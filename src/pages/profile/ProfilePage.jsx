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
    <div className="min-h-screen bg-zinc-900 text-white font-sans antialiased pb-24">
      {/* Background Yellow Header */}
      <div className="h-64 bg-snap-yellow relative rounded-b-[3rem] shadow-2xl overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
         <button
            onClick={() => navigate('/app/settings')}
            className="absolute top-12 right-6 w-10 h-10 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-black hover:bg-black/20 transition-all"
          >
            <Settings size={22} />
          </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-24 relative z-10">
        
        {/* Profile Identity Card */}
        <div className="bg-black/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-36 h-44 rounded-3xl p-[3px] bg-snap-yellow shadow-2xl shadow-snap-yellow/20">
                <div className="w-full h-full rounded-[1.5rem] border-4 border-black overflow-hidden bg-zinc-800">
                  <img
                    src={profile?.photos?.[0] || 'https://via.placeholder.com/150'}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                    alt=""
                  />
                </div>
              </div>
              <button
                onClick={() => navigate('/app/profile/edit')}
                className="absolute -bottom-3 -right-3 w-12 h-12 bg-snap-yellow text-black rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Edit2 size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="text-center mt-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                {profile?.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-snap-yellow font-black uppercase text-[10px] tracking-[0.2em]">
                   {calculateAge(profile.birthday)} Years Old
                </span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-zinc-500 font-bold text-sm lowercase tracking-tight">
                  @{profile?.name?.toLowerCase().replace(' ', '')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 space-y-8">

          {/* Profile Sections - Snap Style */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2">Profile Details</h4>

            <div className="bg-black/20 border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden">
              <div className="p-6">
                <span className="text-[10px] font-black uppercase text-snap-yellow tracking-widest block mb-2">My Bio</span>
                <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                  {profile.bio || "No bio added yet. Add a bio to express yourself!"}
                </p>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-1">Career & School</span>
                   <p className="text-sm font-bold text-white">{profile.job || 'Explore'} · {profile.school || 'Campus'}</p>
                </div>
              </div>

              {profile?.role === 'admin' && (
                <button
                  onClick={() => navigate('/app/admin')}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all text-snap-yellow group"
                >
                  <div className="flex items-center gap-4">
                    <ShieldCheck size={20} />
                    <span className="font-black uppercase text-xs tracking-widest">Admin Dashboard</span>
                  </div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <button className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all text-zinc-300 group">
                <div className="flex items-center gap-4">
                  <Shield size={20} />
                  <span className="font-black uppercase text-xs tracking-widest">Safety & Privacy</span>
                </div>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={signOut}
                className="w-full p-6 flex items-center gap-4 text-snap-red hover:bg-snap-red/5 transition-all font-black uppercase text-xs tracking-widest"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;