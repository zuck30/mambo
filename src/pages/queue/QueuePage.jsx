import React, { useState } from 'react';
import { Plus, Play, CheckCircle2, MoreVertical, Clock, User, Phone, Car as CarIcon, ChevronRight, Search, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { useJobs } from '../../hooks/useJobs';
import { useCustomers } from '../../hooks/useCustomers';
import { useStaff } from '../../hooks/useStaff';
import { useServices } from '../../hooks/useServices';
import { useRealtime } from '../../hooks/useRealtime';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import BottomSheet from '../../components/ui/BottomSheet';
import JobForm from '../../components/forms/JobForm';
import PaymentForm from '../../components/forms/PaymentForm';
import ReceiptModal from '../../components/receipt/ReceiptModal';
import { useUIStore } from '../../store/uiStore';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { usePayments } from '../../hooks/usePayments';
import { supabase } from '../../lib/supabase';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Trash2, Undo2 } from 'lucide-react';

const QueuePage = () => {
  const { jobs, isLoading, createJob, updateJobStatus, deleteJob } = useJobs();
  const { customers } = useCustomers();
  const { staff } = useStaff();
  const { services } = useServices();
  const { createPayment } = usePayments();
  const { modals, openModal, closeModal, selectedItem } = useUIStore();
  const [activeTab, setActiveTab] = useState('waiting');
  const [lastPayment, setLastPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUndoDialogOpen, setIsUndoDialogOpen] = useState(false);

  useRealtime('jobs', ['jobs']);

  const getJobsByStatus = (status) => {
    const filtered = jobs?.filter(j => j.status === status) || [];
    if (!searchTerm) return filtered;
    return filtered.filter(job => 
      job.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.cars?.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };


  const columns = [
    { 
      id: 'waiting', 
      title: 'Tactical Waiting', 
      color: 'bg-slate-100', 
      iconColor: 'text-slate-500',
      image: 'https://cdn-icons-png.flaticon.com/128/11746/11746337.png',
      activeBorder: 'ring-2 ring-slate-500 border-slate-500'
    },
    { 
      id: 'in_progress', 
      title: 'Active Mission', 
      color: 'bg-sky-100', 
      iconColor: 'text-sky-500',
      image: 'https://cdn-icons-png.flaticon.com/128/8999/8999441.png',
      activeBorder: 'ring-2 ring-sky-500 border-sky-500'
    },
    { 
      id: 'done', 
      title: 'Mission Complete', 
      color: 'bg-emerald-100', 
      iconColor: 'text-emerald-500',
      image: 'https://cdn-icons-png.flaticon.com/128/11487/11487199.png',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
  ];

  const handleCreateJob = async (data) => {
    await createJob.mutateAsync(data);
    closeModal('jobForm');
  };

  const handleStartJob = async (id) => {
    await updateJobStatus.mutateAsync({
      id,
      status: 'in_progress',
      started_at: new Date().toISOString()
    });
  };

  const handleCompleteJob = (job) => {
    openModal('paymentForm', job);
  };

  const onPaymentSubmit = async (data) => {
    const user = await supabase.auth.getUser();
    
    const payment = await createPayment.mutateAsync({
      job_id: selectedItem.id,
      customer_id: selectedItem.customer_id,
      amount_due: selectedItem.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0) || 0,
      amount_paid: data.amount_paid,
      payment_method: data.payment_method,
      payment_status: data.amount_paid >= (selectedItem.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0) || 0) ? 'paid' : 'partial',
      paid_at: new Date().toISOString(),
      notes: data.notes || null,
      created_by: user.data.user?.id,
    });

    if (payment) {
      await updateJobStatus.mutateAsync({
        id: selectedItem.id,
        status: 'done',
        completed_at: new Date().toISOString()
      });
    }
    
    setLastPayment(payment);
    closeModal('paymentForm');
    openModal('receipt', selectedItem);
  };

  const handleClosePaymentForm = () => {
    closeModal('paymentForm');
  };

  const handleDeleteJob = async (jobId) => {
    await deleteJob.mutateAsync(jobId);
    setIsDeleteDialogOpen(false);
    closeModal('deleteDialog');
  };

  const handleUndoJob = async (jobId) => {
    await updateJobStatus.mutateAsync({
      id: jobId,
      status: 'in_progress',
    });
    setIsUndoDialogOpen(false);
    closeModal('undoDialog');
  };

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-[#d34932] group-hover:text-white transition-all">
              <CarIcon size={18} className="group-hover:text-white" />
            </div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                {job.job_number}
              </span>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                {job.customers?.full_name}
              </h4>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <CarIcon size={12} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-700">{job.cars?.plate_number}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                {job.cars?.make} {job.cars?.model}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <User size={12} className="text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Assigned Staff Member</p>
              <p className="text-[11px] font-black text-slate-700">{job.profiles?.full_name || 'Unassigned'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.job_services?.map((js, i) => (
            <span key={i} className="px-3 py-1.5 bg-orange-50 text-[#d34932] text-[9px] font-black rounded-full uppercase tracking-widest border border-orange-100">
              {js.services?.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {job.status === 'waiting' && (
            <button
              onClick={() => handleStartJob(job.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-orange-200"
            >
              <Play size={12} className="fill-current" />
              Initiate Mission
            </button>
          )}
          {job.status === 'in_progress' && (
            <button
              onClick={() => handleCompleteJob(job)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
            >
              <CheckCircle2 size={12} />
              Complete Mission
            </button>
          )}
          {job.status === 'done' && (
            <div className="flex-1 flex items-center justify-center py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200">
              <CheckCircle2 size={12} className="mr-2 text-emerald-500" />
              Ready for Checkout
            </div>
          )}
          <div className="flex gap-2">
            {job.status === 'done' && (
              <>
                <button
                  onClick={() => {
                    openModal('undoDialog', job);
                    setIsUndoDialogOpen(true);
                  }}
                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-amber-50 hover:text-amber-500 transition-colors"
                  title="Undo completion"
                >
                  <Undo2 size={14} />
                </button>
                <button
                  onClick={() => {
                    openModal('deleteDialog', job);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete mission"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Clock size={12} />
          {formatDate(job.created_at, 'HH:mm')}
        </div>
        <div className="text-sm font-black text-slate-900">
          {formatCurrency(job.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0))}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CarIcon size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Clock size={14} className="animate-spin" /> Loading Queue
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching operational data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-20 bg-slate-100 rounded" />
                <div className="h-20 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <CarIcon size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Clock size={14} /> Tactical Queue
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Live Mission <span className="text-[#d34932]">Control</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Multi-mission operational oversight with real-time tracking.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('jobForm')}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              New Deployment
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Missions
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, plate, or job number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>
          <div className="md:col-span-6 grid grid-cols-3 gap-2">
            {columns.map(col => (
              <div key={col.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    {col.title.split(' ')[0]}
                  </p>
                  <p className="text-2xl font-black text-slate-900">{getJobsByStatus(col.id).length}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 mb-1">
        {columns.map(col => (
          <button
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={cn(
              "flex-1 py-3 px-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
              activeTab === col.id 
                ? "bg-[#d34932] text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <img 
              src={col.image} 
              alt={col.title}
              className="w-4 h-4 object-contain"
            />
            {col.title.split(' ')[0]} ({getJobsByStatus(col.id).length})
          </button>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-3 gap-1 h-full min-h-[70vh]">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col h-full">
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img 
                      src={col.image} 
                      alt={col.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cpath d=\'M12 8v8M8 12h8\'%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      col.id === 'waiting' ? "bg-slate-400" :
                      col.id === 'in_progress' ? "bg-sky-400 animate-pulse" : "bg-emerald-400"
                    )} />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] mt-1">
                      {col.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                  {getJobsByStatus(col.id).length}
                </span>
              </div>
            </div>
            <div className="flex-1 bg-slate-50/50 rounded-lg p-4 border border-slate-200 overflow-y-auto max-h-[calc(100vh-350px)]">
              <AnimatePresence>
                {getJobsByStatus(col.id).map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </AnimatePresence>
              {getJobsByStatus(col.id).length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    <img 
                      src={col.image} 
                      alt={col.title}
                      className="w-full h-full object-contain opacity-50"
                    />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    No {col.title.toLowerCase()} missions
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden space-y-1">
        <AnimatePresence>
          {getJobsByStatus(activeTab).map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </AnimatePresence>
        {getJobsByStatus(activeTab).length === 0 && (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
              <img 
                src={columns.find(c => c.id === activeTab)?.image} 
                alt={activeTab}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-sm font-black text-slate-900 mb-2">No missions found</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-6">
              {searchTerm ? 'Try adjusting your search' : `No vehicles in ${activeTab.replace('_', ' ')} status`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={modals.jobForm}
        onClose={() => closeModal('jobForm')}
        title="Create Job"
      >
        <JobForm
          onSubmit={handleCreateJob}
          customers={customers}
          staff={staff}
          services={services}
          loading={createJob.isPending}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={modals.paymentForm}
        onClose={handleClosePaymentForm}
        title="Payments"
      >
        <PaymentForm
          job={selectedItem}
          onSubmit={onPaymentSubmit}
          loading={createPayment.isPending}
        />
      </BottomSheet>

      <ReceiptModal
        isOpen={modals.receipt}
        onClose={() => closeModal('receipt')}
        payment={lastPayment}
        job={selectedItem}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          closeModal('deleteDialog');
        }}
        onConfirm={() => handleDeleteJob(selectedItem?.id)}
        title="Delete Mission"
        message="Are you sure you want to delete this mission? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={isUndoDialogOpen}
        onClose={() => {
          setIsUndoDialogOpen(false);
          closeModal('undoDialog');
        }}
        onConfirm={() => handleUndoJob(selectedItem?.id)}
        title="Undo Completion"
        message="Are you sure you want to move this mission back to In Progress?"
        confirmText="Undo"
        variant="warning"
      />
    </div>
  );
};

export default QueuePage;