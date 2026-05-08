import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, Users, Lightbulb, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const AIInsightsPanel = () => {
  const [insights, setInsights] = useState(() => {
    try {
      const saved = localStorage.getItem('garidesk_ai_insights');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse saved insights:', e);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('garidesk-ai');

      if (functionError) throw functionError;
      setInsights(data);
      localStorage.setItem('garidesk_ai_insights', JSON.stringify(data));
    } catch (err) {
      console.error('Tatizo! GariDesk AI nimeshindwa kukupa Insights:', err);
      setError('Tafadhali jaribu tena baadae.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-1">
      <div
        className="p-6 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Brain size={20} className="text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">GariDesk AI Insights</h3>

          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchInsights();
            }}
            disabled={loading}
            className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>
          {expanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              {loading && !insights ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <Brain size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
                  </div>
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse">Nachakata</p>
                </div>
              ) : error ? (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              ) : insights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Daily Summary */}
                  <div className="col-span-1 md:col-span-2 bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={18} className="text-indigo-600" />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Daily Business Intelligence</h4>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                      "{insights.daily_summary}"
                    </p>
                  </div>

                  {/* Profit & Loss */}
                  <div className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-emerald-600">
                      <TrendingUp size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Financial Insights</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{insights.profit_loss}</p>
                  </div>

                  {/* Staff Performance */}
                  <div className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-blue-600">
                      <Users size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Staff Performance</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{insights.staff_performance}</p>
                  </div>

                  {/* Stock Alerts */}
                  <div className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-rose-500">
                      <AlertCircle size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Stock Alerts</h4>
                    </div>
                    <ul className="space-y-2">
                      {insights.stock_alerts.map((alert, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Creative Tip */}
                  <div className="p-5 border border-slate-100 rounded-2xl bg-amber-50/30 border-amber-100/50">
                    <div className="flex items-center gap-2 mb-3 text-amber-600">
                      <Lightbulb size={18} />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Creative Advantage</h4>
                    </div>
                    <p className="text-xs text-slate-700 font-bold leading-relaxed">{insights.creative_tip}</p>
                  </div>


                {/* Recommendations*/}
                <div className="col-span-1 md:col-span-2 p-5 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors bg-white">
                <div className="flex items-center gap-2 mb-4 text-purple-600">
                  <Lightbulb size={18} />
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Strategic Recommendations</h4>
                  </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.recommendations.map((rec, i) => (
                <div 
              key={i} 
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
               >
             <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-black text-indigo-600">{i + 1}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{rec}</p>
            </div>
              ))}
              </div>
            </div>

                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 font-bold italic">No insights available yet. Click refresh to generate.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInsightsPanel;
