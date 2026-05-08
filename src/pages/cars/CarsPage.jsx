import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Car as CarIcon, 
  Grid, 
  List,
  Filter,
  RefreshCw,
  ChevronRight,
  Users,
  Calendar,
  Gauge,
  Palette,
  Tag,
  Award,
  TrendingUp,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { useCars } from '../../hooks/useCars';
import { useCustomers } from '../../hooks/useCustomers';
import DataTable from '../../components/ui/DataTable';
import BottomSheet from '../../components/ui/BottomSheet';
import CarForm from '../../components/forms/CarForm';
import { useUIStore } from '../../store/uiStore';
import HologramCarCard from '../../components/car/HologramCarCard';
import EmptyState from '../../components/ui/EmptyState';
import { cn } from '../../lib/utils';

const CarsPage = () => {
  const navigate = useNavigate();
  const { cars, isLoading, createCar } = useCars();
  const { customers } = useCustomers();
  const { modals, openModal, closeModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');

  // Fixed: Handle null car_type values
  const carTypes = ['all', ...new Set(cars?.map(c => c.car_type || 'Unknown') || [])];
  
  // Fixed: Add null safety checks for all properties
  const filteredCars = cars?.filter(c => {
    const matchesSearch = 
      (c.plate_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.make?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.customers?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || (c.car_type || 'Unknown') === filterType;
    return matchesSearch && matchesType;
  });

  {/*Calculate stats with null safety*/}
  const totalCars = cars?.length || 0;
  const uniqueMakes = new Set(cars?.map(c => c.make).filter(Boolean)).size || 0;
  const totalCustomers = new Set(cars?.map(c => c.customer_id).filter(Boolean)).size || 0;
  const recentCars = cars?.filter(c => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return c.created_at && new Date(c.created_at) >= thirtyDaysAgo;
  }).length || 0;

  const columns = [
    {
      key: 'plate_number',
      label: 'Vehicle',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0">
            <CarIcon size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{row.plate_number || 'N/A'}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {row.make || 'Unknown'} {row.model || 'Unknown'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{row.year || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette size={12} className="text-slate-400" />
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: row.color || '#ccc' }} />
              <span className="text-xs font-bold text-slate-600 capitalize">{row.color || 'Unknown'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'customer',
      label: 'Owner',
      render: (row) => (
        <div>
          <p className="font-black text-slate-900 text-sm mb-0.5">{row.customers?.full_name || 'Unassigned'}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {row.customers?.phone || 'No phone'}
          </p>
        </div>
      )
    },
    {
      key: 'car_type',
      label: 'Type',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-200">
          <Gauge size={10} />
          {row.car_type || 'Unknown'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cars/${row.id}`);
          }}
          className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-xl transition-all group"
        >
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )
    }
  ];

  const onFormSubmit = async (data) => {
    await createCar.mutateAsync(data);
    closeModal('carForm');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CarIcon size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Fleet
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching vehicle database...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-32 bg-slate-100 rounded-lg mb-4" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <CarIcon size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <CarIcon size={14} /> Fleet Management
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Vehicle <span className="text-[#d34932]">Registry</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Manage your fleet, track service history, and monitor vehicle status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/20 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2.5 rounded-lg transition-all",
                    viewMode === 'grid' 
                      ? "bg-[#d34932] text-white shadow-lg" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2.5 rounded-lg transition-all",
                    viewMode === 'list' 
                      ? "bg-[#d34932] text-white shadow-lg" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  <List size={16} />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModal('carForm')}
                className="bg-[#d34932] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
              >
                <Plus size={16} />
                Register Vehicle
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Vehicles</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {totalCars}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <CarIcon size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unique Makes</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {uniqueMakes}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Clients</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {totalCustomers}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recent (30d)</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-purple-500 transition-colors">
              {recentCars}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Vehicles
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by plate, make, model or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              {carTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : (type ? type.toUpperCase() : 'Unknown')}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Showing
              </p>
              <p className="text-sm font-black text-slate-900">
                {filteredCars?.length || 0} vehicles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredCars?.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            <AnimatePresence>
              {filteredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/cars/${car.id}`)}
                >
                  <HologramCarCard
                    make={car.make || 'Unknown'}
                    model={car.model || 'Unknown'}
                    year={car.year || 'N/A'}
                    plate={car.plate_number || 'N/A'}
                    color={car.color || '#ccc'}
                  />
                  <div className="mt-3 px-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-900">{car.customers?.full_name || 'Unassigned'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {car.customers?.phone || 'No phone'}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-[#d34932] group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredCars}
              onRowClick={(row) => navigate(`/cars/${row.id}`)}
            />
          </div>
        )
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
            <CarIcon size={32} className="text-[#d34932]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">No vehicles found</h3>
          <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'Start registering vehicles to track service history'}
          </p>
          {(searchTerm || filterType !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              <RefreshCw size={14} /> Clear Filters
            </button>
          ) : (
            <button
              onClick={() => openModal('carForm')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              <Plus size={14} /> Register First Vehicle
            </button>
          )}
        </div>
      )}

      {/* Car Form Modal */}
      <BottomSheet
        isOpen={modals.carForm}
        onClose={() => closeModal('carForm')}
        title="Register New Vehicle"
      >
        <CarForm
          onSubmit={onFormSubmit}
          customers={customers}
          loading={createCar.isPending}
        />
      </BottomSheet>
    </div>
  );
};

export default CarsPage;