import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, ExternalLink, Phone, TrendingUp, Calendar, Award, ChevronRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { useCustomers } from '../../hooks/useCustomers';
import DataTable from '../../components/ui/DataTable';
import BottomSheet from '../../components/ui/BottomSheet';
import CustomerForm from '../../components/forms/CustomerForm';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import EmptyState from '../../components/ui/EmptyState';

const CustomersPage = () => {
  const navigate = useNavigate();
  const { customers, isLoading, createCustomer } = useCustomers();
  const { modals, openModal, closeModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredCustomers = customers?.filter(c => {
    const matchesSearch = c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'frequent') return matchesSearch && (c.total_visits || 0) >= 5;
    if (filterType === 'recent') {
      const lastVisit = new Date(c.updated_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && lastVisit >= thirtyDaysAgo;
    }
    return matchesSearch;
  });

  // Calculate stats
  const totalCustomers = customers?.length || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;
  const avgVisits = customers?.length > 0 
    ? Math.round(customers.reduce((sum, c) => sum + (c.total_visits || 0), 0) / customers.length) 
    : 0;
  const vipCustomers = customers?.filter(c => (c.total_spent || 0) >= 50000).length || 0;

  const columns = [
    {
      key: 'full_name',
      label: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0 font-black text-sm">
            {row.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm mb-0.5">{row.full_name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Phone size={10} /> {row.phone}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'total_visits',
      label: 'Visits',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900">{row.total_visits || 0}</span>
          {row.total_visits >= 10 && (
            <Award size={14} className="text-amber-500" />
          )}
        </div>
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
          <Calendar size={12} className="text-slate-400" />
          <span className="font-bold text-xs text-slate-700">
            {formatDate(row.updated_at, 'dd MMM yyyy')}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customers/${row.id}`);
          }}
          className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-xl transition-all group"
          title="View Details"
        >
          <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      )
    }
  ];

  const onFormSubmit = async (data) => {
    await createCustomer.mutateAsync(data);
    closeModal('customerForm');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <Users size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Users size={14} /> Loading Database
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching customer records...</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Users size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Users size={14} /> Client Database
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Customer <span className="text-[#d34932]">Relations</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Manage client profiles, track visit history, and monitor loyalty metrics.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('customerForm')}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <UserPlus size={18} className="group-hover:rotate-12 transition-transform" />
              Register Client
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Clients</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {totalCustomers}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Visits</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {avgVisits}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <Calendar size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">VIP Clients</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">
              {vipCustomers}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Clients
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Filter Clients
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Clients</option>
              <option value="frequent">Frequent Visitors (5+ visits)</option>
              <option value="recent">Recent Visitors (Last 30 days)</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex items-end">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Showing Results
              </p>
              <p className="text-sm font-black text-slate-900">
                {filteredCustomers?.length || 0} clients
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredCustomers?.length > 0 ? (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-1">
            <AnimatePresence>
              {filteredCustomers.map((customer) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0 font-black text-base group-hover:bg-[#d34932] group-hover:text-white transition-all">
                        {customer.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 mb-1">{customer.full_name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Phone size={10} /> {customer.phone}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#d34932] group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Visits</p>
                      <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                        {customer.total_visits || 0}
                        {customer.total_visits >= 10 && <Award size={12} className="text-amber-500" />}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
                      <p className="text-sm font-black text-[#d34932]">
                        {formatCurrency(customer.total_spent || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Visit</p>
                      <p className="text-[10px] font-bold text-slate-600">
                        {formatDate(customer.updated_at, 'dd MMM')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredCustomers}
              onRowClick={(row) => navigate(`/customers/${row.id}`)}
            />
          </div>
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-[#d34932]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">No customers found</h3>
          <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'Start building your client database to track visits and loyalty'}
          </p>
          {(searchTerm || filterType !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => openModal('customerForm')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              <UserPlus size={14} /> Register First Client
            </button>
          )}
        </div>
      )}

      <BottomSheet
        isOpen={modals.customerForm}
        onClose={() => closeModal('customerForm')}
        title="Register New Client"
      >
        <CustomerForm
          onSubmit={onFormSubmit}
          loading={createCustomer.isPending}
        />
      </BottomSheet>
    </div>
  );
};

export default CustomersPage;