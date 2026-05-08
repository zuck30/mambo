import React, { useState, useRef } from 'react';
import { Package, Droplet, Zap, FlaskConical } from 'lucide-react';
import { cn } from '../../lib/utils';

const HologramItemCard = ({ name = "", currentStock = 0, unit = "", minimumStock = 0, category = "", className, onClick }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const baseColor = 'rgba(255,255,255,0.2)'; 
  const borderColor = 'rgba(255,255,255,0.1)';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotation({ x: (y - 0.5) * -15, y: (x - 0.5) * 15 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const getIcon = () => {
    const iconProps = {
      className: "w-16 h-16", // Reduced icon size
      strokeWidth: 0.5,
      style: {
        color: baseColor,
        transform: `translateZ(30px)`,
      }
    };

    switch (category?.toLowerCase()) {
      case 'chemicals': return <FlaskConical {...iconProps} />;
      case 'consumables': return <Droplet {...iconProps} />;
      case 'electronics': return <Zap {...iconProps} />;
      default: return <Package {...iconProps} />;
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative w-full max-w-[280px] mx-auto cursor-pointer select-none", className)} // Narrower card
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          background: 'rgba(10, 10, 10, 0.8)',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)',
          border: `1px solid ${borderColor}`,
        }}
      >
        {/* Content Wrapper */}
        <div className="relative p-5 flex flex-col items-center" style={{ transform: 'translateZ(20px)' }}>
          
          {/* Static Stage - Smaller height */}
          <div className="relative w-full h-24 flex items-center justify-center mt-2 mb-4">
            {/* Base Circle - Smaller */}
            <div className="absolute w-20 h-20 rounded-full border border-white/5" style={{ transform: 'rotateX(75deg)' }} />

            {/* Core Icon */}
            <div className="relative z-10">
              {getIcon()}
            </div>
          </div>

          {/* Data Section */}
          <div className="w-full border-t border-white/5 pt-3">
            <h2 className="text-lg font-bold uppercase tracking-tight text-white/60 truncate w-full">
              <span>{name.split(' ')[0]}</span>
              <span className="ml-1.5 text-white/20 text-sm">{name.split(' ').slice(1).join(' ')}</span>
            </h2>
            
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-[7px] uppercase tracking-[0.2em] text-white/20">Available</p>
                <p className="text-xl font-mono font-black text-white/40">
                  {currentStock}<span className="text-[10px] ml-1 opacity-40">{unit}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Corner */}
        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
          <div key={i} className={cn("absolute w-2 h-2 border-t border-l opacity-10", pos, i===1 && "rotate-90", i===2 && "-rotate-90", i===3 && "rotate-180")} 
            style={{ borderColor: '#fff' }} />
        ))}
      </div>
    </div>
  );
};

export default HologramItemCard;