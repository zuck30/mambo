import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import AppCard from './AppCard';
import { cn } from '../../lib/utils';

const StatCard = ({ icon: Icon, value, label, trend, trendValue, iconColor = "text-primary" }) => {
  return (
    <AppCard className="group hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
          <h3 className="text-3xl font-black mt-2 text-navy tracking-tighter">{value}</h3>
          {trend && (
            <div className="flex items-center mt-3 bg-gray-50 self-start px-2 py-1 rounded-lg">
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-success mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-danger mr-1" />
              )}
              <span className={cn(
                "text-[10px] font-black",
                trend === 'up' ? "text-success" : "text-danger"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-4 rounded-[20px] bg-gray-50 group-hover:bg-navy group-hover:text-white transition-colors duration-300 shadow-inner", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </AppCard>
  );
};

export default StatCard;
