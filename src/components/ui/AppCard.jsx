import React from 'react';
import { cn } from '../../lib/utils';

const AppCard = ({ children, className, noPadding = false, glass = false }) => {
  return (
    <div className={cn(
      "rounded-[32px] overflow-hidden transition-all duration-300",
      glass
        ? "glass-card border-white/40"
        : "bg-white border border-gray-100 shadow-sm hover:shadow-md",
      !noPadding && "p-6",
      className
    )}>
      {children}
    </div>
  );
};

export default AppCard;
