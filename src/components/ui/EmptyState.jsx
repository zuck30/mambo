import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Search,
  title = "No results found",
  message = "Try adjusting your search or filters to find what you're looking for.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-navy">{title}</h3>
      <p className="mt-2 text-gray-500 max-w-sm mx-auto">{message}</p>
      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
