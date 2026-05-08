import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Flame, Mail, Lock, AlertCircle, Loader2, UserPlus, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/home`
        }
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) throw error;
      setShowOtp(true);
      toast.success('Verification code sent to your email!');
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

      // New users go to onboarding
      navigate('/onboarding');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
        <Crown size={350} />
      </div>
      <div className="absolute -left-20 -bottom-20 opacity-[0.03] pointer-events-none">
        <Crown size={300} />
      </div>

      <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#ff79ac]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#ff79ac]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8 relative">
          <div className="flex items-center justify-center gap-2">
            <Flame className="text-[#ff79ac] fill-current" size={40} />
            <span className="text-3xl font-black tracking-tighter text-white">oa</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-6">Create account</h2>
          <p className="text-sm text-white/60 mt-2">
            Join Oa and start discovering connections globally.
          </p>
        </div>

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
          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 bg-white text-black rounded-lg font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-white/40 font-medium">Or</span></div>
            </div>

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
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {loading ? 'Sending code...' : 'Create account'}
              </button>
            </form>
          </div>
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="w-full text-white/60 text-sm hover:text-white transition-colors"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-sm text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
        </p>

        <p className="text-[10px] text-center text-white/40 mt-8 px-8">
          By signing up, you agree to our <Link to="/terms" className="underline">Terms</Link>. Learn how we process your data in our <Link to="/privacy" className="underline">Privacy Policy</Link> and <Link to="/cookie-policy" className="underline">Cookie Policy</Link>.
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
