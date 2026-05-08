import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import logo from '../../assets/garidesk.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access Granted');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{

          backgroundImage: 'url("https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:border-white/30">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <img src={logo} alt="GariDesk Logo" className="h-16 sm:h-20 w-16 sm:w-20 mx-auto mb-4 object-cover rounded-full border-2 border-white/20 shadow-lg" />
            <h2 className="text-white text-xl font-light tracking-[0.3em]">GariDesk</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/50 transition-all"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/50 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Forgot Credentials?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-4 px-4 overflow-hidden rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


// LOGIN PAGE WITH VIDEO
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { toast } from 'react-hot-toast';
// import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
// import logo from '../../assets/garidesk.png';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(email, password);
//       toast.success('Access Granted');
//       navigate('/');
//     } catch (error) {
//       toast.error(error.message || 'Authentication Failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
//       {/* Background YouTube Video with Overlay */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute inset-0 w-full h-full">
//           <iframe
//             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto pointer-events-none"
//             src="https://www.youtube.com/embed/JbPBHtLstGw?autoplay=1&loop=1&playlist=JbPBHtLstGw&controls=0&showinfo=0&rel=0&mute=1&start=5&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
//             title="2024 Mercedes-AMG GT Background"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             allowFullScreen
//             style={{
//               objectFit: 'cover',
//             }}
//           ></iframe>
//         </div>
//         {/* Dark overlay for better text readability */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[2px]" />
//       </div>

//       {/* Glassmorphic Card */}
//       <div className="relative z-10 w-full max-w-[90%] sm:max-w-md mx-auto">
//         <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:border-white/30">
          
//           {/* Header */}
//           <div className="text-center mb-8 sm:mb-10">
//             <img src={logo} alt="GariDesk Logo" className="h-16 sm:h-20 w-16 sm:w-20 mx-auto mb-4 object-cover rounded-full border-2 border-white/20 shadow-lg" />
//             <h2 className="text-white text-xl font-light tracking-[0.3em]">GariDesk</h2>
//             <p className="text-white/60 text-xs tracking-wider mt-2">LUXURY AUTOMOTIVE</p>
//           </div>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Email Field */}
//             <div className="relative group">
//               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
//               <input
//                 type="email"
//                 required
//                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/50 transition-all"
//                 placeholder="Email Address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {/* Password Field */}
//             <div className="relative group">
//               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
//               <input
//                 type="password"
//                 required
//                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/30 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-black/50 transition-all"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => navigate('/forgot-password')}
//                 className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
//               >
//                 Forgot Credentials?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex items-center justify-center py-4 px-4 overflow-hidden rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <>
//                   Enter Dashboard
//                   <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;