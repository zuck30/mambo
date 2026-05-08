import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Plus, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditProfilePage = () => {
  const { profile, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    job: profile?.job || '',
    school: profile?.school || '',
    interests: profile?.interests || [],
    photos: profile?.photos || []
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);
      if (error) throw error;
      await fetchProfile(profile.id);
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, photos: [...prev.photos, publicUrl] }));
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark pb-20">
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/5 bg-dark-card sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 text-dark-text">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-black">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-primary font-bold"
        >
          Done
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Photos Grid */}
        <div className="grid grid-cols-3 gap-2 aspect-square">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-surface rounded-xl overflow-hidden relative">
              {formData.photos[i] ? (
                <>
                  <img src={formData.photos[i]} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                    className="absolute -top-1 -right-1 bg-white text-dark rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex items-center justify-center cursor-pointer">
                  <input type="file" className="hidden" onChange={handlePhotoUpload} disabled={loading} />
                  <Plus className="text-white/20" />
                  <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1">
                    <Camera size={12} className="text-white" />
                  </div>
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-dark-text uppercase mb-2">About Me</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full bg-dark-card border border-white/5 rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-text uppercase mb-2">Job Title</label>
            <input
              type="text"
              value={formData.job}
              onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
              className="w-full bg-dark-card border border-white/5 rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Add Job Title"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-text uppercase mb-2">School</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className="w-full bg-dark-card border border-white/5 rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Add School"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
