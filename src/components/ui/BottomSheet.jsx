import React, { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div
        className={cn(
          "absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-xl bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out flex flex-col max-h-[90vh]",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
          <h3 className="text-lg font-bold text-navy mt-1">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
