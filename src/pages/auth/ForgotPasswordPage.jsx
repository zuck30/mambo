import React from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans px-4">
      {/* Background YouTube Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto pointer-events-none"
            src="https://www.youtube.com/embed/JbPBHtLstGw?autoplay=1&loop=1&playlist=JbPBHtLstGw&controls=0&showinfo=0&rel=0&mute=1&start=5&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            title="2024 Mercedes-AMG GT Background"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              objectFit: 'cover',
            }}
          ></iframe>
        </div>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all hover:border-white/30 text-center">
          <div className="space-y-6">
            {/* Icon or Logo Placeholder */}
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 21h-15a.75.75 0 01-.75-.75v-1.5a5.25 5.25 0 0110.5 0v1.5a.75.75 0 01-.75.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12.75a6 6 0 00-6 6v1.5h12v-1.5a6 6 0 00-6-6z" />
              </svg>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Reset Password
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Please contact your administrator to reset your password.
            </p>
            
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="group inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-medium transition-all duration-300 hover:gap-3"
              >
                <span>Back to Login</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;