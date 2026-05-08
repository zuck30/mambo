import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  Calendar,
  Car as CarIcon,
  History,
  Edit2,
  ChevronLeft,
  Trophy,
  Plus,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import StatCard from '../../components/ui/StatCard';
import { TableSkeleton, CardSkeleton } from '../../components/ui/LoadingSpinner';
import { useCustomers } from '../../hooks/useCustomers';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import HologramCarCard from '../../components/car/HologramCarCard';
import StatusBadge from '../../components/ui/StatusBadge';
import BottomSheet from '../../components/ui/BottomSheet';
import CarForm from '../../components/forms/CarForm';
import CustomerForm from '../../components/forms/CustomerForm';
import { useUIStore } from '../../store/uiStore';
import { useCars } from '../../hooks/useCars';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, isLoading, updateCustomer } = useCustomers(id);
  const { modals, openModal, closeModal, selectedItem } = useUIStore();
  const { createCar } = useCars();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CarIcon size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Clock size={14} className="animate-spin" /> Loading Profile
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching customer data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
            <div className="h-20 bg-slate-100 rounded-full w-20 mx-auto mb-4" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto" />
          </div>
          <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-slate-100 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-20 bg-slate-100 rounded" />
              <div className="h-20 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) return (
    <div className="flex flex-col gap-1 p-1 md:p-4">
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
          <CarIcon size={32} className="text-rose-500" />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-2">Customer not found</h3>
        <button
          onClick={() => navigate('/customers')}
          className="px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
        >
          Back to Customers
        </button>
      </div>
    </div>
  );

  const getLoyaltyTier = (visits) => {
    if (visits > 20) return { name: 'Gold Elite', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🏆' };
    if (visits > 5) return { name: 'Silver', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: '🥈' };
    return { name: 'Bronze', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🥉' };
  };

  const loyalty = getLoyaltyTier(customer.total_visits || 0);
  const lastVisit = customer.jobs?.[0]?.created_at;
  const averageSpend = customer.total_visits > 0 
    ? (customer.total_spent || 0) / customer.total_visits 
    : 0;

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Back Navigation */}
     <button
  onClick={() => navigate('/customers')}
  className="flex items-center gap-2 text-slate-400 hover:text-[#d34932] transition-colors mb-2 group w-fit"
  >
  <span className="text-xs font-bold uppercase tracking-wide">Back to Customers</span>
</button>

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Award size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
          
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  {loyalty.icon} {loyalty.name} Member
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2">
                  {customer.full_name}
                </h2>
                <p className="text-slate-400 font-bold flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Joined {formatDate(customer.created_at, 'MMM yyyy')}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="flex items-center gap-1">
                    <CreditCard size={14} />
                    ID: #{customer.id?.slice(0, 8)}
                  </span>
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('customerForm', customer)}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20 flex items-center gap-2"
            >
              <Edit2 size={14} />
              Edit Profile
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Visits</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {customer.total_visits || 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <History size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {formatCurrency(customer.total_spent || 0)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Spend</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {formatCurrency(averageSpend)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <CreditCard size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Cars</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-purple-500 transition-colors">
              {customer.cars?.length || 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
            <CarIcon size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Contact Info Sidebar */}
        <div className="space-y-1">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Phone size={16} className="text-[#d34932]" />
              </div>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone size={16} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-black text-slate-900">{customer.phone}</p>
                </div>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Mail size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                    <p className="text-sm font-black text-slate-900">{customer.email}</p>
                  </div>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <MapPin size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                    <p className="text-sm font-black text-slate-900">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loyalty Card */}
          <div className={cn(
            "bg-white border rounded-lg shadow-sm p-6",
            loyalty.border
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", loyalty.bg)}>
                <Trophy size={20} className={loyalty.color} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{loyalty.name} Status</h4>
                <p className="text-[10px] text-slate-400 font-bold">Loyalty Tier</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500">Progress to next tier</span>
                <span className="text-[10px] font-black text-[#d34932]">
                  {customer.total_visits > 20 ? 'Max' : `${customer.total_visits || 0}/5`}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d34932] to-orange-500 rounded-full transition-all"
                  style={{ width: `${Math.min(((customer.total_visits || 0) / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-1">
          {/* Cars Section */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <CarIcon size={20} className="text-[#d34932]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Registered Vehicles</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic">Fleet under this client</p>
                </div>
              </div>
              <button
                onClick={() => openModal('carForm')}
                className="flex items-center gap-2 px-4 py-2 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-orange-200"
              >
                <Plus size={14} />
                Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.cars?.map((car) => (
                <HologramCarCard
                  key={car.id}
                  make={car.make}
                  model={car.model}
                  year={car.year}
                  plate={car.plate_number}
                  color={car.color}
                  className="max-w-none"
                />
              ))}
              {(!customer.cars || customer.cars.length === 0) && (
                <div className="col-span-2 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <CarIcon size={20} className="text-slate-400" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No vehicles registered
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Service History */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <History size={20} className="text-[#d34932]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Service History</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic">Recent maintenance records</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Job #</th>
                    <th className="px-6 py-4">Services</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customer.jobs?.slice(0, 10).map((job) => (
                    <tr key={job.id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          <span className="font-bold text-xs text-slate-700">
                            {formatDate(job.created_at, 'dd MMM yyyy')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-900 text-sm">{job.job_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {job.job_services?.map((js, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-50 text-[#d34932] text-[9px] font-black rounded-full uppercase tracking-widest border border-orange-100">
                              {js.services?.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-black text-slate-900">
                          {formatCurrency(job.job_services?.reduce((sum, js) => sum + Number(js.subtotal), 0))}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!customer.jobs || customer.jobs.length === 0) && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                          <History size={20} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          No service history available
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

      <BottomSheet
        isOpen={modals.customerForm}
        onClose={() => closeModal('customerForm')}
        title="Edit Client Profile"
      >
        <CustomerForm
          onSubmit={async (data) => {
            await updateCustomer.mutateAsync({ id, ...data });
            closeModal('customerForm');
          }}
          initialData={customer}
          loading={updateCustomer.isPending}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={modals.carForm}
        onClose={() => closeModal('carForm')}
        title="Register New Vehicle"
      >
        <CarForm
          onSubmit={async (data) => {
            await createCar.mutateAsync(data);
            closeModal('carForm');
          }}
          customers={[customer]}
          initialData={{ customer_id: id }}
          loading={createCar.isPending}
        />
      </BottomSheet>
    </div>
  );
};

export default CustomerDetailPage;