import React, { useState, useRef, useEffect } from 'react';
import { Car, Bike, Truck, Zap, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getCarLogoUrl } from '../../lib/car-utils';

const HologramCarCard = ({ make, model, plate, color = '#00f3ff', carType, className }) => {
  const cardRef = useRef(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  // 3D Mouse tracking
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -25; // -12.5 to 12.5 deg
    const rotateY = (x - 0.5) * 25;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Random glitch trigger
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);
    cardRef.current?.dataset && (cardRef.current.dataset.glitchInterval = glitchInterval);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
    const interval = cardRef.current?.dataset?.glitchInterval;
    if (interval) clearInterval(interval);
  };

  // Convert hex to RGB for dynamic theming
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 243, b: 255 };
  };

  const rgb = hexToRgb(color);
  const secondaryColor = '#ff0055'; // Cyberpunk magenta accent

  const getIcon = () => {
    const iconProps = {
      className: "w-32 h-32 transition-all duration-300",
      strokeWidth: 0.5,
      style: {
        color: color,
        filter: `drop-shadow(0 0 20px ${color}) drop-shadow(0 0 40px ${color}80)`,
        transform: `translateZ(50px) scale(${isHovering ? 1.1 : 1})`,
      }
    };

    if (make && !logoError && carType !== 'Motorcycle' && carType !== 'Bajaji') {
      return (
        <div className="relative w-40 h-40 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <img
            src={getCarLogoUrl(make)}
            alt={make}
            className={cn(
              "w-full h-full object-contain transition-all duration-500",
              logoLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{
              filter: `drop-shadow(0 0 30px ${color}) brightness(1.5) contrast(1.2)`,
              mixBlendMode: 'screen',
              transform: `translateZ(40px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)`,
            }}
            onLoad={() => setLogoLoaded(true)}
            onError={() => setLogoError(true)}
          />
          {!logoLoaded && !logoError && (
            <Loader2 className="w-12 h-12 animate-spin absolute" style={{ color: color }} />
          )}
        </div>
      );
    }

    switch (carType) {
      case 'Motorcycle':
        return <Bike {...iconProps} />;
      case 'Bajaji':
        return (
          <div className="relative" style={{ transform: 'translateZ(50px)' }}>
            <Zap {...iconProps} className={cn(iconProps.className, "rotate-180")} />
            <div className="absolute inset-0 animate-ping opacity-30">
              <Zap className="w-32 h-32" style={{ color: secondaryColor }} />
            </div>
          </div>
        );
      case 'Truck':
        return <Truck {...iconProps} />;
      default:
        return <Car {...iconProps} />;
    }
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative w-full max-w-md mx-auto cursor-pointer select-none",
        className
      )}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Card Container with 3D Transform */}
      <div
        className={cn(
          "relative overflow-hidden transition-transform duration-100 ease-out",
          glitchActive && "animate-glitch-shake"
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, rgba(5,5,5,0.95) 0%, rgba(20,20,30,0.98) 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)',
          border: `1px solid ${color}40`,
          boxShadow: isHovering 
            ? `0 20px 60px -10px ${color}60, 0 0 30px ${color}30 inset`
            : `0 10px 30px -10px ${color}40`,
        }}
      >
        {/* Holographic Background Layer */}
        <div 
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background: `
              conic-gradient(
                from ${rotation.y * 2}deg at ${50 + rotation.x}% ${50 + rotation.y}%,
                ${color}00 0deg,
                ${color}40 60deg,
                ${secondaryColor}60 120deg,
                ${color}40 180deg,
                ${color}00 360deg
              )
            `,
            mixBlendMode: 'color-dodge',
            filter: 'blur(20px)',
          }}
        />

        {/* Animated Scanlines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div 
            className="w-full h-full"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              backgroundSize: '100% 4px',
              animation: 'scanline 8s linear infinite',
            }}
          />
        </div>

        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${color}20 1px, transparent 1px),
              linear-gradient(90deg, ${color}20 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            transform: `translateZ(-50px) rotateX(${rotation.x * 0.2}deg) rotateY(${rotation.y * 0.2}deg)`,
          }}
        />

        {/* Holographic Shimmer Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: `
              linear-gradient(
                ${135 + rotation.y * 3}deg,
                transparent 0%,
                ${color}20 45%,
                ${secondaryColor}30 50%,
                ${color}20 55%,
                transparent 100%
              )
            `,
            transform: `translateX(${rotation.y * 10}px) translateY(${rotation.x * 10}px)`,
          }}
        />

        {/* Content Container */}
        <div className="relative p-8 flex flex-col items-center" style={{ transform: 'translateZ(20px)' }}>
          
          {/* Top Badge - Vehicle Type */}
          <div 
            className="absolute top-4 left-4 px-3 py-1 text-[10px] font-black tracking-[0.3em] uppercase"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}60`,
              color: color,
              clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
              textShadow: `0 0 10px ${color}`,
            }}
          >
            {carType || 'VEHICLE'}
          </div>

          {/* License Plate - Top Right */}
          <div 
            className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 border-2 border-white/20 rounded"
            style={{
              transform: 'rotate(2deg) translateZ(30px)',
              boxShadow: `0 0 20px ${color}40`,
            }}
          >
            <span className="text-white font-black text-xs tracking-widest">
              {plate || 'HOLO-01'}
            </span>
          </div>

          {/* Main Hologram Display Area */}
          <div className="relative w-full h-48 flex items-center justify-center mt-8 mb-6">
            {/* Rotating Rings */}
            <div 
              className="absolute w-48 h-48 rounded-full border border-dashed opacity-30"
              style={{ 
                borderColor: color,
                animation: 'spin 20s linear infinite',
                transform: 'rotateX(60deg) translateZ(-20px)',
              }}
            />
            <div 
              className="absolute w-56 h-56 rounded-full border opacity-20"
              style={{ 
                borderColor: secondaryColor,
                animation: 'spin 15s linear infinite reverse',
                transform: 'rotateX(60deg) translateZ(-30px)',
              }}
            />

            {/* Glow Under Icon */}
            <div 
              className="absolute w-32 h-8 rounded-full blur-xl opacity-60"
              style={{ 
                background: color,
                transform: 'translateY(60px) translateZ(-10px)',
              }}
            />

            {/* The Icon/Logo */}
            <div style={{ transform: 'translateZ(50px)' }}>
              {getIcon()}
            </div>

            {/* Chromatic Aberration Effect */}
            {isHovering && (
              <>
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen opacity-50"
                  style={{ transform: 'translateX(-3px) translateZ(51px)', color: '#ff0000' }}
                >
                  {getIcon()}
                </div>
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen opacity-50"
                  style={{ transform: 'translateX(3px) translateZ(51px)', color: '#00ffff' }}
                >
                  {getIcon()}
                </div>
              </>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="w-full space-y-3" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-end justify-between border-b border-white/10 pb-3">
              <div>
                <h2 
                  className={cn(
                    "text-2xl font-black uppercase tracking-tighter transition-all",
                    glitchActive && "animate-glitch-text"
                  )}
                  style={{ 
                    color: '#fff',
                    textShadow: `0 0 20px ${color}`,
                  }}
                  data-text={`${make || 'UNKNOWN'} ${model || ''}`}
                >
                  <span style={{ color: color }}>{make || 'UNKNOWN'}</span>
                  <span className="text-white/60 ml-2">{model || 'MODEL'}</span>
                </h2>
              </div>
              <div 
                className="text-3xl font-black"
                style={{ 
                  color: secondaryColor,
                  textShadow: `0 0 20px ${secondaryColor}`,
                }}
              >
                {''}
              </div>
            </div>
          </div>

          {/* Color Indicator */}
          <div 
            className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-white/30"
            style={{ 
              background: color,
              boxShadow: `0 0 20px ${color}, inset 0 0 10px rgba(255,255,255,0.5)`,
              transform: 'translateZ(40px)',
            }}
          />
        </div>

        {/* Corner Decorations */}
        {['top-0 left-0 border-r-0 border-b-0', 'top-0 right-0 border-l-0 border-b-0', 
          'bottom-0 left-0 border-r-0 border-t-0', 'bottom-0 right-0 border-l-0 border-t-0'].map((pos, i) => (
          <div 
            key={i}
            className={cn("absolute w-4 h-4 border-2", pos)}
            style={{ borderColor: i === 3 ? secondaryColor : color }}
          />
        ))}

        {/* Glitch Overlay */}
        {glitchActive && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-difference z-50"
            style={{
              background: `linear-gradient(${Math.random() * 360}deg, ${color}40, transparent, ${secondaryColor}40)`,
              clipPath: `polygon(${Math.random() * 100}% 0, 100% ${Math.random() * 100}%, ${Math.random() * 100}% 100%, 0 ${Math.random() * 100}%)`,
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes spin {
          from { transform: rotateX(60deg) rotateZ(0deg); }
          to { transform: rotateX(60deg) rotateZ(360deg); }
        }
        .animate-glitch-shake {
          animation: glitch-shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes glitch-shake {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        .animate-glitch-text {
          position: relative;
        }
        .animate-glitch-text::before,
        .animate-glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .animate-glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 ${secondaryColor};
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        .animate-glitch-text::after {
          left: -2px;
          text-shadow: -2px 0 ${color};
          clip: rect(85px, 550px, 140px, 0);
          animation: glitch-anim 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% { clip: rect(10px, 9999px, 30px, 0); }
          20% { clip: rect(80px, 9999px, 100px, 0); }
          40% { clip: rect(10px, 9999px, 50px, 0); }
          60% { clip: rect(60px, 9999px, 80px, 0); }
          80% { clip: rect(30px, 9999px, 60px, 0); }
          100% { clip: rect(90px, 9999px, 100px, 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip: rect(60px, 9999px, 80px, 0); }
          20% { clip: rect(10px, 9999px, 30px, 0); }
          40% { clip: rect(90px, 9999px, 100px, 0); }
          60% { clip: rect(30px, 9999px, 50px, 0); }
          80% { clip: rect(70px, 9999px, 90px, 0); }
          100% { clip: rect(20px, 9999px, 40px, 0); }
        }
      `}</style>
    </div>
  );
};

export default HologramCarCard;