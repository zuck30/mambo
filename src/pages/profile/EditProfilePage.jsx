import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Plus, X, Camera, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const GOALS_OPTIONS = [
  { id: 'long_term', label: 'Long-term partner', icon: '💘' },
  { id: 'long_term_open', label: 'Long-term, open to short', icon: '😍' },
  { id: 'short_term_open', label: 'Short-term, open to long', icon: '🥂' },
  { id: 'short_term', label: 'Short-term fun', icon: '🎉' },
  { id: 'new_friends', label: 'New friends', icon: '👋' },
  { id: 'still_figuring', label: 'Still figuring it out', icon: '🤔' }
];

const EditProfilePage = () => {
  const { profile, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    job: profile?.job || '',
    school: profile?.school || '',
    photos: profile?.photos || [],
    relationship_goal: profile?.relationship_goal || '',
    smart_photos_enabled: profile?.smart_photos_enabled || false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id);
      if (error) throw error;
      await fetchProfile(profile.id);
      toast.success('Profile updated');
      navigate('/app/profile');
    } catch (error) {
      toast.error('Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-20">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 h-16 px-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="text-lg font-black tracking-tight">Edit Profile</h1>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="text-theme-yellow font-black text-sm uppercase tracking-widest"
        >
          {loading ? '...' : 'Done'}
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Photo Grid Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3 px-2">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">My Photos</h3>
            <span className="text-[10px] font-bold text-zinc-400">{formData.photos.length}/6</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900/40 rounded-2xl border border-white/5 overflow-hidden relative group shadow-2xl">
                {formData.photos[i] ? (
                  <>
                    <img src={formData.photos[i]} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => setFormData(p => ({...p, photos: p.photos.filter((_, idx) => idx !== i)}))}
                      className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white border border-white/10"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-2 left-2 bg-theme-yellow text-black text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                        Main
                      </div>
                    )}
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input type="file" className="hidden" />
                    <Plus className="text-zinc-600" size={24} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Info Fields */}
        <div className="space-y-8">

          {/* Relationship Goals */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Relationship Goals</label>
            <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden shadow-2xl">
              {GOALS_OPTIONS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setFormData(p => ({...p, relationship_goal: goal.label}))}
                  className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-xl">{goal.icon}</span>
                  <span className={`text-sm font-bold ${formData.relationship_goal === goal.label ? 'text-white' : 'text-zinc-500'}`}>
                    {goal.label}
                  </span>
                  {formData.relationship_goal === goal.label && <Check size={18} className="ml-auto text-theme-yellow" strokeWidth={4} />}
                </button>
              ))}
            </div>
          </section>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">About Me</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))}
              className="w-full bg-zinc-900/40 border border-white/10 rounded-[2rem] p-6 min-h-[140px] focus:outline-none focus:border-theme-yellow/50 text-sm font-medium text-white shadow-xl"
              placeholder="Tell them something interesting..."
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">Job Title</label>
              <input
                type="text"
                value={formData.job}
                onChange={(e) => setFormData(p => ({...p, job: e.target.value}))}
                className="w-full h-14 bg-zinc-900/40 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-theme-yellow/50 text-sm font-bold shadow-xl text-white"
                placeholder="Software Engineer"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData(p => ({...p, school: e.target.value}))}
                className="w-full h-14 bg-zinc-900/40 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-theme-yellow/50 text-sm font-bold shadow-xl text-white"
                placeholder="Add School"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;