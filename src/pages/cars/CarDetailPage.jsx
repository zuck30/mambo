import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Calendar,
  Clock,
  History,
  Wrench,
  Gauge,
  Palette,
  Settings,
  Phone,
  Mail,
  Award,
  TrendingUp,
  AlertCircle,
  Edit2,
  MoreVertical,
  Car as CarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import { TableSkeleton, CardSkeleton } from '../../components/ui/LoadingSpinner';
import { useCars } from '../../hooks/useCars';
import { useCustomers } from '../../hooks/useCustomers';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import HologramCarCard from '../../components/car/HologramCarCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useUIStore } from '../../store/uiStore';
import BottomSheet from '../../components/ui/BottomSheet';
import CarForm from '../../components/forms/CarForm';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { car, isLoading, updateCar } = useCars(id);
  const { customers } = useCustomers();
  const { modals, openModal, closeModal } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CarIcon size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Clock size={14} className="animate-spin" /> Loading Vehicle
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching vehicle data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
            <div className="h-80 bg-slate-100 rounded-lg mb-4" />
          </div>
          <div className="space-y-1">
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-32 bg-slate-100 rounded-lg" />
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-64 bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
            <CarIcon size={32} className="text-rose-500" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">Vehicle not found</h3>
          <button
            onClick={() => navigate('/cars')}
            className="px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
          >
            Back to Fleet
          </button>
        </div>
      </div>
    );
  }

  const totalSpent = car.jobs?.reduce((sum, job) => {
    return sum + (job.job_services?.reduce((s, js) => s + Number(js.subtotal), 0) || 0);
  }, 0) || 0;

  const lastService = car.jobs?.[0];
  const serviceCount = car.jobs?.length || 0;
  const avgServiceCost = serviceCount > 0 ? totalSpent / serviceCount : 0;

  const onUpdateSubmit = async (data) => {
    await updateCar.mutateAsync({ id, ...data });
    closeModal('carForm');
  };

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 text-slate-400 hover:text-[#d34932] transition-colors mb-2 group w-fit"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Fleet</span>
      </button>

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <CarIcon size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
           
              <div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2">
                  {car.make} <span className="text-[#d34932]">{car.model}</span>
                </h2>
                <p className="text-slate-400 font-bold flex items-center gap-4">

                  <span className="flex items-center gap-1">
                    <Palette size={14} />
                    <div className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: car.color }} />
                    <span className="capitalize">{car.color}</span>
                  </span>
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('carForm', car)}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20 flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit Vehicle
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Services</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {serviceCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <Wrench size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Service Cost</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {formatCurrency(avgServiceCost)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Service</p>
            <p className="text-lg font-black text-slate-900 group-hover:text-purple-500 transition-colors">
              {lastService ? formatDate(lastService.created_at, 'dd MMM') : 'Never'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Left Column - Car Visual & Specs */}
        <div className="lg:col-span-1 space-y-1">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <HologramCarCard
              make={car.make}
              model={car.model}
              year={car.year}
              plate={car.plate_number}
              color={car.color}
              className="max-w-none"
            />
          </div>

          {/* Specifications Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Settings size={20} className="text-[#d34932]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Notes</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Color</p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: car.color }} />
                    <span className="text-sm font-black text-slate-900 capitalize">{car.color}</span>
                  </div>
                </div>
              </div>
              {car.notes && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                  <p className="text-xs text-slate-600 font-medium italic">{car.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Owner & History */}
        <div className="lg:col-span-2 space-y-1">
          {/* Owner Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <User size={20} className="text-[#d34932]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Owner Information</h3>
                <p className="text-[10px] text-slate-400 font-bold italic">Registered owner details</p>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-all group"
              onClick={() => navigate(`/customers/${car.customers?.id}`)}
            >
              <div className="flex items-center gap-4">
              
                <div>
                  <p className="font-black text-slate-900 text-base mb-1">{car.customers?.full_name}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                      <Phone size={10} /> {car.customers?.phone}
                    </span>
                    {car.customers?.email && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                        <Mail size={10} /> {car.customers?.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronLeft size={16} className="text-slate-300 group-hover:text-[#d34932] group-hover:translate-x-1 transition-all rotate-180" />
            </div>
          </div>

          {/* Service History Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <History size={20} className="text-[#d34932]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Service History</h3>
                    <p className="text-[10px] text-slate-400 font-bold italic">Complete maintenance records</p>
                  </div>
                </div>
                {serviceCount > 0 && (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {serviceCount} records
                  </span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Job Details</th>
                    <th className="px-6 py-4">Services</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {car.jobs?.map((job) => (
                    <tr 
                      key={job.id} 
                      className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-black text-slate-900 text-sm mb-1">{job.job_number}</p>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                              <Calendar size={10} />
                              {formatDate(job.created_at, 'dd MMM yyyy')}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                              <User size={10} />
                              {job.profiles?.full_name || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {job.job_services?.slice(0, 2).map((js, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-50 text-[#d34932] text-[9px] font-black rounded-full uppercase tracking-widest">
                              {js.services?.name}
                            </span>
                          ))}
                          {job.job_services?.length > 2 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full">
                              +{job.job_services.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-[#d34932]">
                          {formatCurrency(job.job_services?.reduce((sum, js) => sum + Number(js.subtotal), 0) || 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!car.jobs || car.jobs.length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                          <History size={20} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          No service records found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Car Modal */}
      <BottomSheet
        isOpen={modals.carForm}
        onClose={() => closeModal('carForm')}
        title="Edit Vehicle"
      >
        <CarForm
          onSubmit={onUpdateSubmit}
          initialData={car}
          customers={customers}
          loading={updateCar.isPending}
        />
      </BottomSheet>
    </div>
  );
};

export default CarDetailPage;