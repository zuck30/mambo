import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Flame, Mail, Lock, Loader2, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        options: { redirectTo: `${window.location.origin}/onboarding` }
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
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: true }
      });
      if (error) throw error;
      setShowOtp(true);
      toast.success('Verification code sent!');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'magiclink',
      });
      if (error) throw error;
      navigate('/onboarding');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden font-sans antialiased">
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://w.wallhaven.cc/full/6l/wallhaven-6lkzzq.png")' }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-10" />
      </div>
      
      {/* Background Glows with Original Colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#ff79ac]/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#ff79ac]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="text-center mb-10">
          <Flame className="text-[#ff79ac] fill-current mx-auto mb-4" size={52} />
          <h1 className="text-white text-3xl font-black tracking-tight">Create Account</h1>
          <p className="text-white/50 text-xs font-bold tracking-widest mt-2 uppercase">Join mambo Today</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.div key="r1" className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full h-12 bg-white text-black rounded-full font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95"
                >
                  <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                  SIGN UP WITH GOOGLE
                </button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  <span className="text-white/20 text-[10px] font-bold tracking-widest uppercase">Or</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full h-12 px-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white placeholder:text-white/30 text-center focus:border-[#ff79ac] focus:outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] text-white rounded-full font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'CONTINUE'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="r2" className="space-y-4">
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  className="w-full h-14 bg-white/10 border border-white/10 rounded-2xl text-white text-center text-2xl tracking-[0.4em] font-bold focus:border-[#ff79ac] focus:outline-none transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] text-white rounded-full font-bold text-sm shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'FINISH SIGN UP'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center space-y-6">
          <p className="text-white/60 text-sm">
            Already have an account? <Link to="/login" className="text-[#ff79ac] font-bold hover:underline">Log in</Link>
          </p>
          <p className="text-[10px] leading-relaxed text-white/40 px-6 italic">
            By signing up, you agree to our <span className="underline">Terms</span> & <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>

      <div className="absolute -top-20 -left-20 opacity-[0.02] pointer-events-none">
        <Crown size={350} />
      </div>
    </div>
  );
};

export default RegisterPage;