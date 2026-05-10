import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Flame, Mail, Lock, Loader2, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
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
      toast.success('Check your email!');
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
      const { error, data: { session } } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'magiclink',
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_onboarded')
        .eq(id, session.user.id)
        .single();

      navigate(profile?.is_onboarded ? '/app/home' : '/onboarding');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden font-sans antialiased bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-sm opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516589174184-c68526674fd6?q=80&w=2000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
      </div>
      
      {/* Interactive Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center p-4 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 mb-8 shadow-2xl"
          >
            <Flame className="text-primary fill-current" size={48} />
          </motion.div>
          <h2 className="text-5xl font-black tracking-tighter text-white italic mb-4">mambo</h2>
          <p className="text-zinc-400 text-sm font-medium px-8 leading-relaxed">
            Premium dating for those who value <span className="text-white">authentic</span> connections.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 primary-gradient text-white rounded-2xl font-black text-sm tracking-[0.1em] shadow-xl shadow-primary/20 disabled:opacity-50 transition-all flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'CONTINUE'}
                  </motion.button>
                </form>

                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-zinc-600 text-[10px] font-black tracking-[0.3em]">OR</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="w-full h-14 bg-white text-black rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all"
                >
                  <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                  GOOGLE
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-2xl tracking-[0.4em] font-bold focus:border-[#ff79ac] focus:outline-none transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#ff79ac] to-[#ff4d8c] text-white rounded-full font-bold text-sm flex items-center justify-center shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'VERIFY & LOG IN'}
                </button>
                <button
                  onClick={() => setShowOtp(false)}
                  className="w-full text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Change Email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Don't have an account? <Link to="/register" className="text-[#ff79ac] font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>

      {/* Decorative Crown Watermark */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none">
        <Crown size={300} />
      </div>
    </div>
  );
};

export default LoginPage;