import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { translations } from '../../lib/translations';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, LogOut, Trash2, Bell, Shield, Phone, Flame, Globe, ChevronDown, Lock, Eye, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { profile, signOut, fetchProfile } = useAuth();
  const { language, setLanguage } = useAuthStore();
  const t = translations[language];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '');
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ phone: phoneNumber })
        .eq('id', profile.id);
      if (error) throw error;
      await fetchProfile(profile.id);
      setIsEditingPhone(false);
      toast.success('Phone number updated');
    } catch (error) {
      toast.error('Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      setLoading(true);
      try {
        await supabase.from('messages').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
        await supabase.from('matches').delete().or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`);
        await supabase.from('swipes').delete().or(`swiper_id.eq.${profile.id},swiped_id.eq.${profile.id}`);

        const { error } = await supabase.from('profiles').delete().eq('id', profile.id);
        if (error) throw error;

        await signOut();
        navigate('/login');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete account. Please contact support.');
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
        <h1 className="text-xl font-black">{t.settings}</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Language Settings */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">{t.language}</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-dark-text" />
                <span>{t.language}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${language === 'en' ? 'bg-primary text-white' : 'bg-dark-surface text-dark-text'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('sw')}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${language === 'sw' ? 'bg-primary text-white' : 'bg-dark-surface text-dark-text'}`}
                >
                  SW
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">Account Settings</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-dark-text" />
                  <span>{t.phone_number}</span>
                </div>
                <button
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className="text-primary font-bold text-sm"
                >
                  {isEditingPhone ? t.cancel : (profile?.phone ? 'Edit' : 'Add')}
                </button>
              </div>

              {isEditingPhone ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-grow bg-dark-surface border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    {t.save}
                  </button>
                </div>
              ) : (
                <span className="text-dark-text ml-8 block">{profile?.phone || 'Not set'}</span>
              )}
            </div>
            <button className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-dark-text" />
                <span>{t.notifications}</span>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </button>
            <div className="w-full">
              <button
                onClick={() => toggleSection('safety')}
                className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-dark-text" />
                  <span>{t.privacy_safety}</span>
                </div>
                <ChevronDown size={20} className={`text-dark-text transition-transform ${expandedSection === 'safety' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'safety' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white/5"
                  >
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex gap-4">
                          <Shield className="text-primary shrink-0" size={24} />
                          <div>
                            <h4 className="font-bold text-sm">Member Verification</h4>
                            <p className="text-xs text-dark-text">AI and human moderation to keep bots and scammers off.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Lock className="text-primary shrink-0" size={24} />
                          <div>
                            <h4 className="font-bold text-sm">Data Privacy</h4>
                            <p className="text-xs text-dark-text">Your information is encrypted and protected.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Eye className="text-primary shrink-0" size={24} />
                          <div>
                            <h4 className="font-bold text-sm">Reporting</h4>
                            <p className="text-xs text-dark-text">Report inappropriate behavior instantly.</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <AlertTriangle className="text-primary shrink-0" size={24} />
                          <div>
                            <h4 className="font-bold text-sm">Safety Tips</h4>
                            <p className="text-xs text-dark-text">Guides on how to stay safe online and offline.</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="font-bold text-sm mb-2">Meeting Safely</h4>
                        <ul className="text-xs text-dark-text space-y-1 list-disc pl-4">
                          <li>Always meet in a public place.</li>
                          <li>Tell a friend or family member about your plans.</li>
                          <li>Stay in control of your transportation.</li>
                          <li>Trust your instincts. If something feels wrong, leave.</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Legal */}
        <section>
          <h3 className="text-sm font-bold text-dark-text uppercase tracking-widest mb-4">Legal</h3>
          <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
            <div className="w-full">
              <button
                onClick={() => toggleSection('privacy')}
                className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span>Privacy Policy</span>
                <ChevronDown size={20} className={`text-dark-text transition-transform ${expandedSection === 'privacy' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'privacy' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white/5"
                  >
                    <div className="p-6 text-xs text-dark-text space-y-4">
                      <p className="italic">Last Updated: May 20, 2024</p>
                      <div>
                        <h4 className="font-bold text-white mb-1">1. Introduction</h4>
                        <p>Oa is committed to protecting your privacy globally, including in Africa, East Africa, and other international regions.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">2. Information We Collect</h4>
                        <p>We collect name, email, phone, photos, bio, location data (with permission), and messages.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">3. How We Use Information</h4>
                        <p>To provide services, facilitate matches, verify identity, and prevent fraud.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">4. Global Data Transfers</h4>
                        <p>Information may be processed in various countries with appropriate safeguards in place.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-full">
              <button
                onClick={() => toggleSection('terms')}
                className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span>Terms of Service</span>
                <ChevronDown size={20} className={`text-dark-text transition-transform ${expandedSection === 'terms' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedSection === 'terms' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white/5"
                  >
                    <div className="p-6 text-xs text-dark-text space-y-4">
                      <p className="italic">Last Updated: May 20, 2024</p>
                      <div>
                        <h4 className="font-bold text-white mb-1">1. Acceptance of Terms</h4>
                        <p>By creating an Oa account, you agree to be bound by these Terms of Service.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">2. Eligibility</h4>
                        <p>You must be at least 18 years of age to create an account on Oa.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">3. Prohibited Content</h4>
                        <p>Offensive, sexually explicit, harassing, or illegal content is strictly prohibited.</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">4. Termination</h4>
                        <p>We reserve the right to terminate accounts that violate these Terms or harm other users.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <button
            onClick={signOut}
            className="w-full bg-dark-card text-white font-bold py-4 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
          >
            <LogOut size={20} /> {t.logout}
          </button>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full text-red-500 font-bold py-4 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> {t.delete_account}
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
