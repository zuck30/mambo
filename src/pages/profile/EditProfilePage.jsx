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
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-12">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 h-16 px-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">Edit Profile</h1>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="text-snap-yellow font-black text-sm uppercase tracking-widest flex items-center"
        >
          {loading ? '...' : <><Check size={18} className="mr-1"/> Done</>}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Photo Grid Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Photos</h3>
            <span className="text-[11px] text-zinc-600">{formData.photos.length}/6</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden relative group">
                {formData.photos[i] ? (
                  <>
                    <img src={formData.photos[i]} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => setFormData(p => ({...p, photos: p.photos.filter((_, idx) => idx !== i)}))}
                      className="absolute top-2 right-2 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-white/10"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input type="file" className="hidden" />
                    <Plus className="text-zinc-600 mb-1" size={24} />
                    <Camera size={14} className="text-zinc-700" />
                  </label>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Info Fields */}
        <div className="space-y-12">

          {/* Relationship Goals */}
          <section className="space-y-4">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1">Relationship Goals</label>
            <div className="grid grid-cols-1 gap-2">
              {GOALS_OPTIONS.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setFormData(p => ({...p, relationship_goal: goal.label}))}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-3 ${
                    formData.relationship_goal === goal.label
                      ? 'border-snap-yellow bg-snap-yellow/5 text-white'
                      : 'border-white/5 bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="text-xl">{goal.icon}</span>
                  <span className="text-sm font-bold">{goal.label}</span>
                  {formData.relationship_goal === goal.label && <Check size={16} className="ml-auto text-snap-yellow" />}
                </button>
              ))}
            </div>
          </section>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1">About Me</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(p => ({...p, bio: e.target.value}))}
              className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-5 min-h-[140px] focus:outline-none focus:ring-1 focus:ring-primary/50 text-zinc-200"
              placeholder="Tell them something interesting..."
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1">Job Title</label>
              <input
                type="text"
                value={formData.job}
                onChange={(e) => setFormData(p => ({...p, job: e.target.value}))}
                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl px-5 focus:outline-none focus:ring-1 focus:ring-primary/50 text-zinc-200"
                placeholder="Software Engineer"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest px-1">School</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData(p => ({...p, school: e.target.value}))}
                className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl px-5 focus:outline-none focus:ring-1 focus:ring-primary/50 text-zinc-200"
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