import React from 'react';
import { cn } from '../../lib/utils';

const StatusBadge = ({ status }) => {
  const getStyles = (s) => {
    switch (s?.toLowerCase()) {
      case 'waiting':
        return 'bg-gray-100 text-gray-600';
      case 'in_progress':
        return 'bg-sky-100 text-sky-600';
      case 'done':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-danger/10 text-danger';
      case 'paid':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'partial':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center",
      getStyles(status)
    )}>
      {status?.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
