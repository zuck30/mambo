import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-sm text-gray-500 font-medium">Loading data...</p>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/4" />
      <div className="h-8 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded w-full" />
    </div>
  );
};

export default LoadingSpinner;
