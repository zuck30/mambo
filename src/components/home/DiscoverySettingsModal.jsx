import React, { useState, useEffect } from 'react';
import { X, MapPin, Search, Navigation, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = [
  { name: 'Nairobi, Kenya', lat: -1.2921, lon: 36.8219 },
  { name: 'Dar es Salaam, Tanzania', lat: -6.7924, lon: 39.2083 },
  { name: 'Kampala, Uganda', lat: 0.3476, lon: 32.5825 },
  { name: 'Kigali, Rwanda', lat: -1.9441, lon: 30.0619 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 }
];

const DiscoverySettingsModal = ({ isOpen, onClose, profile, onSave }) => {
  const [distance, setDistance] = useState(profile?.distance_pref || 80);
  const [ageRange, setAgeRange] = useState([profile?.min_age_pref || 18, profile?.max_age_pref || 100]);
  const [showGender, setShowGender] = useState(profile?.show_gender || 'everyone');
  const [passportLocation, setPassportLocation] = useState({
    lat: profile?.passport_latitude,
    lon: profile?.passport_longitude,
    name: profile?.passport_location_name
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // For iOS Safari extra protection
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-dark-card w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-black">Discovery Settings</h2>
            <button onClick={onClose} className="p-2 text-dark-text hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-10 pb-32">

            {/* Passport Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                <h3 className="font-black uppercase tracking-widest text-[11px] text-zinc-500">Passport</h3>
              </div>

              <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                <button
                  onClick={() => setPassportLocation({ lat: null, lon: null, name: null })}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Navigation size={18} className={!passportLocation.lat ? 'text-primary' : 'text-zinc-600'} />
                    <div className="text-left">
                      <p className="text-sm font-bold">Current Location</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Use GPS</p>
                    </div>
                  </div>
                  {!passportLocation.lat && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,121,172,0.6)]" />}
                </button>

                {CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => setPassportLocation({ lat: city.lat, lon: city.lon, name: city.name })}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin size={18} className={passportLocation.name === city.name ? 'text-primary' : 'text-zinc-600'} />
                      <div className="text-left">
                        <p className="text-sm font-bold">{city.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Passport</p>
                      </div>
                    </div>
                    {passportLocation.name === city.name && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,121,172,0.6)]" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Distance */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Maximum Distance</span>
                <span className="text-primary font-bold">{distance}km</span>
              </div>
              <input
                type="range"
                min="2"
                max="500"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full accent-primary bg-dark-surface h-1 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-dark-text font-bold">2km</span>
                <span className="text-[10px] text-dark-text font-bold">500km</span>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <div className="flex justify-between mb-4">
                <span className="font-bold">Age Range</span>
                <span className="text-primary font-bold">{ageRange[0]} - {ageRange[1]}</span>
              </div>
              <div className="flex gap-4">
                <div className="flex-grow">
                  <span className="text-[10px] text-dark-text uppercase font-bold">Min</span>
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={ageRange[0]}
                    onChange={(e) => setAgeRange([parseInt(e.target.value), Math.max(parseInt(e.target.value), ageRange[1])])}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] text-dark-text uppercase font-bold">Max</span>
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={ageRange[1]}
                    onChange={(e) => setAgeRange([Math.min(parseInt(e.target.value), ageRange[0]), parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>
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
          </div>

          {/* Fixed Footer for the Done Button */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-card via-dark-card to-transparent pt-10">
            <button
              onClick={() => onSave({
                distance_pref: distance,
                min_age_pref: ageRange[0],
                max_age_pref: ageRange[1],
                show_gender: showGender,
                passport_latitude: passportLocation.lat,
                passport_longitude: passportLocation.lon,
                passport_location_name: passportLocation.name
              })}
              className="w-full primary-gradient text-white font-bold py-4 rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Done
            </button>
            {/* Spacer for iPhone home indicator */}
            <div className="h-safe-bottom" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DiscoverySettingsModal;
