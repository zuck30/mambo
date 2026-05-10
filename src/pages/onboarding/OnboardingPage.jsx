import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Camera, X, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INTERESTS_OPTIONS = [
  'Travel', 'Music', 'Fitness', 'Cooking', 'Gaming',
  'Art', 'Photography', 'Reading', 'Movies', 'Dancing',
  'Sports', 'Technology', 'Nature', 'Fashion', 'Yoga'
];

const OnboardingPage = () => {
  const { user, profile, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (profile?.is_onboarded) {
      navigate('/app/home');
    }
  }, [profile, navigate]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    gender: '',
    show_gender: '',
    photos: [],
    interests: [],
    latitude: null,
    longitude: null,
    location_name: '',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      updateFormData('photos', [...formData.photos, publicUrl]);
    } catch (error) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    updateFormData('photos', newPhotos);
  };

  const toggleInterest = (interest) => {
    const newInterests = [...formData.interests];
    if (newInterests.includes(interest)) {
      updateFormData('interests', newInterests.filter(i => i !== interest));
    } else {
      updateFormData('interests', [...newInterests, interest]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          is_onboarded: true,
          updated_at: new Date(),
        });

      if (error) throw error;
      await fetchProfile(user.id);
      navigate('/app/home');
      toast.success('Welcome to Oa!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: "What's your name?",
      subtitle: "This is how you'll appear on mambo.",
      content: (
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="First Name"
          className="w-full bg-transparent border-b-2 border-white/20 py-4 text-3xl text-white focus:outline-none focus:border-primary transition-colors"
          autoFocus
        />
      ),
      isValid: formData.name.length >= 2,
    },
    {
      id: 2,
      title: "When's your birthday?",
      subtitle: "Your age will be public. You must be at least 18.",
      content: (
        <input
          type="date"
          value={formData.birthday}
          onChange={(e) => updateFormData('birthday', e.target.value)}
          className="w-full bg-dark-surface border border-white/10 rounded-xl px-4 py-4 text-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      ),
      isValid: formData.birthday && (new Date().getFullYear() - new Date(formData.birthday).getFullYear() >= 18),
    },
    {
      id: 3,
      title: "What's your gender?",
      content: (
        <div className="space-y-4">
          {['male', 'female', 'non-binary'].map(g => (
            <button
              key={g}
              onClick={() => updateFormData('gender', g)}
              className={`w-full py-4 rounded-full border-2 transition-all text-xl capitalize ${
                formData.gender === g ? 'border-primary bg-primary/10 text-white' : 'border-white/20 text-dark-text'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      ),
      isValid: !!formData.gender,
    },
    {
      id: 4,
      title: "Who would you like to see?",
      content: (
        <div className="space-y-4">
          {['men', 'women', 'everyone'].map(pref => (
            <button
              key={pref}
              onClick={() => updateFormData('show_gender', pref)}
              className={`w-full py-4 rounded-full border-2 transition-all text-xl capitalize ${
                formData.show_gender === pref ? 'border-primary bg-primary/10 text-white' : 'border-white/20 text-dark-text'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      ),
      isValid: !!formData.show_gender,
    },
    {
      id: 5,
      title: "Show off your best photos",
      subtitle: "Upload at least 2 photos to continue.",
      content: (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] relative">
              {formData.photos[i] ? (
                <div className="w-full h-full rounded-xl overflow-hidden group">
                  <img src={formData.photos[i]} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -top-2 -right-2 bg-white text-dark rounded-full p-1 shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="w-full h-full rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={loading} />
                  <Plus className="text-white/40" />
                </label>
              )}
            </div>
          ))}
        </div>
      ),
      isValid: formData.photos.length >= 2,
    },
    {
      id: 6,
      title: "Interests",
      subtitle: "Select at least 3 interests to find your match.",
      content: (
        <div className="flex flex-wrap gap-2">
          {INTERESTS_OPTIONS.map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full border transition-all ${
                formData.interests.includes(interest)
                  ? 'border-primary bg-primary text-white'
                  : 'border-white/20 text-dark-text'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      ),
      isValid: formData.interests.length >= 3,
    },
    {
      id: 7,
      title: "Enable Location",
      subtitle: "We use your location to show people nearby.",
      content: (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Check size={48} className="text-primary" />
            </motion.div>
          </div>
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  updateFormData('latitude', pos.coords.latitude);
                  updateFormData('longitude', pos.coords.longitude);
                  updateFormData('location_name', 'Nearby');
                  toast.success('Location enabled!');
                },
                () => {
                  toast.error('Could not get location. Please allow access.');
                }
              );
            }}
            className="px-8 py-3 bg-white text-dark font-bold rounded-full"
          >
            Allow Location
          </button>
        </div>
      ),
      isValid: !!formData.latitude,
    }
  ];

  const currentStep = steps.find(s => s.id === step);

  return (
    <div className="min-h-screen bg-dark text-white p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-grow flex flex-col">
        <div className="mb-8 flex gap-1">
          {steps.map(s => (
            <div
              key={s.id}
              className={`h-1 flex-grow rounded-full transition-all ${
                s.id <= step ? 'bg-primary' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="flex-grow flex flex-col"
        >
          <h2 className="text-4xl font-black mb-2">{currentStep.title}</h2>
          {currentStep.subtitle && <p className="text-dark-text mb-8">{currentStep.subtitle}</p>}

          <div className="mt-4">
            {currentStep.content}
          </div>
        </motion.div>

        <div className="mt-8">
          <button
            onClick={() => step === steps.length ? handleComplete() : setStep(s => s + 1)}
            disabled={!currentStep.isValid || loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Saving...' : step === steps.length ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
