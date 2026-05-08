import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Flame, Mail, Lock, AlertCircle, Loader2, LogIn, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      if (error) throw error;
      setShowOtp(true);
      toast.success('Check your email for the verification code!');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
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
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Crown Watermarks */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
        <Crown size={350} />
      </div>
      <div className="absolute -left-20 -bottom-20 opacity-[0.03] pointer-events-none">
        <Crown size={300} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] pointer-events-none">
        <Crown size={250} />
      </div>
      
      {/* Subtle gradient orbs - keeping your pink/red tones */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#ff79ac]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#ff79ac]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo - Clean like landing page */}
        <div className="text-center mb-8 relative">
          {/* Small crown near logo */}
          <div className="absolute -top-8 -right-4 opacity-[0.06] pointer-events-none">
            <Crown size={50} />
          </div>
          <div className="absolute -bottom-4 -left-6 opacity-[0.04] pointer-events-none">
            <Crown size={40} />
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Flame className="text-[#ff79ac] fill-current" size={40} />
            <span className="text-3xl font-black tracking-tighter text-white">oa</span>
          </div>
          <p className="text-sm text-white/60 mt-4">
            By clicking Continue, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {!showOtp ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-[#ff79ac] focus:outline-none focus:ring-1 focus:ring-[#ff79ac] text-white text-sm placeholder:text-white/30"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? 'Sending...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1">Verification Code</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-[#ff79ac] focus:outline-none focus:ring-1 focus:ring-[#ff79ac] text-white text-center text-sm tracking-[0.3em] placeholder:text-white/30"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? 'Verifying...' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setOtp('');
                setError('');
              }}
              className="w-full text-white/60 text-sm hover:text-white transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
        
        {/* Decorative crown at bottom of form */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none">
          <Crown size={80} />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;