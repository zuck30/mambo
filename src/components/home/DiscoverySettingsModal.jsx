import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiscoverySettingsModal = ({ isOpen, onClose, profile, onSave }) => {
  const [distance, setDistance] = useState(profile?.distance_pref || 80);
  const [ageRange, setAgeRange] = useState([profile?.min_age_pref || 18, profile?.max_age_pref || 55]);
  const [showGender, setShowGender] = useState(profile?.show_gender || 'everyone');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="bg-dark-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-24 sm:pb-8 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black">Discovery Settings</h2>
            <button onClick={onClose} className="p-2 text-dark-text hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Distance */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Maximum Distance</span>
                <span className="text-primary font-bold">{distance}km</span>
              </div>
              <input
                type="range"
                min="2"
                max="160"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full accent-primary bg-dark-surface h-1 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Age Range */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Age Range</span>
                <span className="text-primary font-bold">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="18"
                  max="55"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                  className="w-full accent-primary"
                />
                <input
                  type="range"
                  min="18"
                  max="55"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            {/* Show Me */}
            <div>
              <span className="block font-bold mb-4">Show Me</span>
              <div className="bg-dark-surface rounded-2xl overflow-hidden divide-y divide-white/5">
                {['men', 'women', 'everyone'].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setShowGender(pref)}
                    className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="capitalize">{pref}</span>
                    {showGender === pref && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSave({ distance_pref: distance, min_age_pref: ageRange[0], max_age_pref: ageRange[1], show_gender: showGender })}
              className="w-full primary-gradient text-white font-bold py-4 rounded-full"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DiscoverySettingsModal;
