import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Settings, Edit2, Shield, CreditCard, ChevronRight, ShieldCheck, Crown, LogOut, ChevronLeft, Aperture, Users, Compass, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F0F1F2] text-black font-sans antialiased pb-24">
      {/* Snapchat-style Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50">
         <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-sm"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-zinc-400 shadow-sm" onClick={() => navigate('/app/settings')}>
            <Settings size={22} />
          </div>
      </header>

      <div className="pt-24 max-w-2xl mx-auto px-4">
        
        {/* Profile Snapcode Section */}
        <div className="flex flex-col items-center mb-12">
            <div className="relative">
              {/* The "Snapcode" Yellow Square */}
              <div className="w-48 h-48 bg-snap-yellow rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="w-36 h-36 rounded-[2rem] border-4 border-black overflow-hidden bg-white z-10">
                  <img
                    src={profile?.photos?.[0] || 'https://via.placeholder.com/150'}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
                {/* Decorative Dots */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-1.5 h-1.5 bg-black rounded-full" style={{
                    top: `${Math.sin(i * Math.PI / 4) * 40 + 50}%`,
                    left: `${Math.cos(i * Math.PI / 4) * 40 + 50}%`
                  }} />
                ))}
              </div>
              <button
                onClick={() => navigate('/app/profile/edit')}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-xl border border-zinc-100 hover:scale-105 transition-all"
              >
                <Edit2 size={20} strokeWidth={3} />
              </button>
            </div>

            <div className="text-center mt-6">
              <h2 className="text-3xl font-black tracking-tight leading-none">
                {profile?.name}
              </h2>
              <p className="text-zinc-500 font-bold text-sm mt-1">
                {profile?.name?.toLowerCase().replace(' ', '')} <span className="mx-1">·</span> {calculateAge(profile.birthday)}
              </p>
            </div>
        </div>

        <div className="space-y-6">
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-2 border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-snap-yellow/10 flex items-center justify-center text-snap-yellow">
                   <Users size={24} fill="currentColor" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Friends</span>
             </div>
             <div className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-2 border border-zinc-100">
                <div className="w-12 h-12 rounded-full bg-snap-blue/10 flex items-center justify-center text-snap-blue">
                   <Aperture size={24} fill="currentColor" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">My Story</span>
             </div>
          </div>

          {/* Details List */}
          <div className="bg-white rounded-[2rem] divide-y divide-zinc-50 overflow-hidden shadow-sm border border-zinc-100">
              <button
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-snap-blue/10 flex items-center justify-center text-snap-blue">
                    <Aperture size={20} />
                  </div>
                  <div>
                    <span className="font-black uppercase text-[10px] tracking-widest block text-snap-blue">My Public Profile</span>
                    <span className="text-[11px] text-zinc-400 font-bold">Tap to view what others see</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-zinc-300" />
              </button>

              <div className="p-6">
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3">About Me</h4>
                <p className="text-zinc-800 text-sm font-medium leading-relaxed">
                  {profile.bio || "Tap to add a bio and let people know what you're about!"}
                </p>
              </div>

              <div className="p-6">
                 <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-3">Essentials</h4>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                          <Compass size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Career</p>
                          <p className="text-sm font-bold text-black">{profile.job || 'Add Career'}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                          <MapPin size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-0.5">Campus</p>
                          <p className="text-sm font-bold text-black">{profile.school || 'Add School'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {profile?.role === 'admin' && (
                <button
                  onClick={() => navigate('/app/admin')}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-all group border-t border-zinc-50"
                >
                  <div className="flex items-center gap-4 text-snap-yellow">
                    <ShieldCheck size={20} />
                    <span className="font-black uppercase text-xs tracking-widest">Admin Dashboard</span>
                  </div>
                  <ChevronRight size={20} className="text-zinc-300" />
                </button>
              )}
          </div>

          {/* Secondary Actions */}
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-zinc-100">
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
  );
};

export default ProfilePage;