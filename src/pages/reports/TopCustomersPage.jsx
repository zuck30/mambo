import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronLeft,
  Search,
  Filter,
  RefreshCw,
  Clock,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useReports } from '../../hooks/useReports';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import DataTable from '../../components/ui/DataTable';
import { startOfYear, endOfYear, format } from 'date-fns';

const TopCustomersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch data for the current year by default
  const { customerStats, isLoading } = useReports(
    format(startOfYear(new Date()), 'yyyy-MM-dd'),
    format(endOfYear(new Date()), 'yyyy-MM-dd')
  );

  const filteredCustomers = customerStats?.filter(c =>
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'rank',
      label: '#',
      render: (_, i) => (
        <span className="font-black text-slate-400">{i + 1}</span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0 font-black text-sm">
            {row.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-slate-900">{row.full_name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">ID: #{row.id?.slice(0, 8)}</p>
          </div>
        </div>
      )
    },
    {
      key: 'total_visits',
      label: 'Visits',
      sortable: true,
      render: (row) => (
        <span className="font-black text-slate-900">{row.total_visits || 0}</span>
      )
    },
    {
      key: 'total_spent',
      label: 'Total Spent',
      sortable: true,
      render: (row) => (
        <span className="font-black text-[#d34932]">{formatCurrency(row.total_spent || 0)}</span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Visit',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={12} className="text-slate-400" />
          <span className="font-bold text-xs">{formatDate(row.updated_at, 'dd MMM yyyy')}</span>
        </div>
      )
    },
    {
      key: 'tier',
      label: 'Tier',
      render: (row) => {
        const visits = row.total_visits || 0;
        const isGold = visits > 20;
        const isSilver = visits > 5;

        return (
          <span className={cn(
            "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
            isGold ? "bg-amber-50 text-amber-600 border border-amber-200" :
            isSilver ? "bg-slate-100 text-slate-600 border border-slate-200" :
            "bg-orange-50 text-orange-600 border border-orange-200"
          )}>
            {isGold ? 'Gold' : isSilver ? 'Silver' : 'Bronze'}
          </span>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center gap-2 text-slate-400 hover:text-[#d34932] transition-colors mb-2 group w-fit"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Reports</span>
      </button>

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Award size={300} />
        </div>
        <div className="relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Award size={14} /> Loyalty Analytics
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
              Top <span className="text-[#d34932]">Customers</span>
            </h2>
            <p className="text-lg text-slate-400 font-bold">
              Full ranking of your most loyal and valuable clients.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Customers
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Analysis Period
                </p>
                <p className="text-sm font-black text-slate-900">
                  Full Year {new Date().getFullYear()}
                </p>
              </div>
              <Users size={20} className="text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCustomers || []}
            onRowClick={(row) => navigate(`/customers/${row.id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default TopCustomersPage;
