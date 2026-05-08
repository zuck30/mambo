import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Flame, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      if (error) throw error;
      setShowOtp(true);
      toast.success('Check your email for the verification code!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error, data: { session } } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_onboarded')
        .eq('id', session.user.id)
        .single();

      if (profile?.is_onboarded) {
        navigate('/app/home');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff79ac]/10 to-transparent pointer-events-none" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md space-y-8 bg-dark-card p-10 rounded-[32px] shadow-2xl border border-white/5 relative z-10"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <Flame size={64} className="text-primary fill-current" />
          </div>
          <h1 className="mt-4 text-4xl font-black text-white italic">oa</h1>
          <p className="mt-6 text-dark-text text-sm">
            By clicking Log In, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.
          </p>
        </div>

        {!showOtp ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-text" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-full pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
            >
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-dark-text uppercase tracking-widest mb-3 ml-4">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="0 0 0 0 0 0"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-dark-surface border border-white/10 rounded-2xl px-4 py-4 text-white text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
            >
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </button>
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full text-dark-text text-sm font-bold hover:text-white transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
