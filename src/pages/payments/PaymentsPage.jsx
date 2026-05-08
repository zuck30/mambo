import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Calendar, 
  FileText, 
  Download,
  TrendingUp,
  RefreshCw,
  DollarSign,
  Receipt,
  Wallet,
  Smartphone,
  Banknote,
  Printer,
  Mail
} from 'lucide-react';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { usePayments } from '../../hooks/usePayments';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/ui/DataTable';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';
import { format } from 'date-fns';
import ReceiptModal from '../../components/receipt/ReceiptModal';
import { useUIStore } from '../../store/uiStore';
import { pdf } from '@react-pdf/renderer';
import PaymentsReportPDF from '../reports/PaymentsReportPDF';
import toast from 'react-hot-toast';

const PaymentsPage = () => {
  const { isSecretary } = useAuth();
  const { payments, isLoading } = usePayments();
  const { modals, openModal, closeModal, selectedItem } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const paymentMethods = ['all', ...new Set(payments?.map(p => p.payment_method) || [])];
  
  const filteredPayments = payments?.filter(p => {
    const matchesSearch = 
      p.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.jobs?.job_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = filterMethod === 'all' || p.payment_method === filterMethod;
    const matchesStatus = filterStatus === 'all' || p.payment_status === filterStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const thisMonth = format(new Date(), 'yyyy-MM');
  
  const todayPayments = payments?.filter(p => 
    format(new Date(p.created_at), 'yyyy-MM-dd') === today
  ) || [];
  const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  
  const monthPayments = payments?.filter(p => 
    format(new Date(p.created_at), 'yyyy-MM') === thisMonth
  ) || [];
  const monthRevenue = monthPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  
  const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
  const avgTransaction = payments?.length > 0 ? totalRevenue / payments.length : 0;

  const handleExportCSV = () => {
    if (!filteredPayments || filteredPayments.length === 0) {
      toast.error('No payments to export');
      return;
    }
    const headers = [
      'Date', 'Receipt Number', 'Job Number', 'Customer Name', 'Phone',
      'Plate Number', 'Vehicle', 'Amount Paid', 'Amount Due',
      'Payment Method', 'mobile Ref', 'Status', 'Handled By', 'Is_Late_Payment'
    ];
    const csvData = filteredPayments.map(p => {
      const vehicle = p.jobs?.cars ? `${p.jobs.cars.make} ${p.jobs.cars.model}` : 'N/A';
      const isLate = p.amount_due > p.amount_paid ? 'YES' : 'NO';
      return [
        format(new Date(p.created_at), 'yyyy-MM-dd HH:mm'),
        `"${p.receipt_number}"`,
        `"${p.jobs?.job_number || 'N/A'}"`,
        `"${p.customers?.full_name || 'N/A'}"`,
        `"${p.customers?.phone || 'N/A'}"`,
        `"${p.jobs?.cars?.plate_number || 'N/A'}"`,
        `"${vehicle}"`,
        p.amount_paid,
        p.amount_due,
        p.payment_method,
        `"${p.mobile_reference || 'N/A'}"`,
        p.payment_status,
        `"${p.profiles?.full_name || 'N/A'}"`,
        isLate
      ].join(',');
    });
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handlePrint = async () => {
    if (!filteredPayments || filteredPayments.length === 0) {
      toast.error('No payments to print');
      return;
    }
    try {
      const dateRangeText = `${format(new Date(), 'dd MMM yyyy')}`;
      const blob = await pdf(
        <PaymentsReportPDF 
          payments={filteredPayments} 
          dateRange={dateRangeText}
          generatedAt={new Date()}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        toast.error('Please allow popups to print');
      }
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF print error:', error);
      toast.error('Failed to generate report');
    }
  };

  const methodBreakdown = payments?.reduce((acc, p) => {
    acc[p.payment_method] = (acc[p.payment_method] || 0) + Number(p.amount_paid);
    return acc;
  }, {});

  const getMethodIcon = (method) => {
    switch(method) {
      case 'cash': return Banknote;
      case 'mobile': return Smartphone;
      case 'card': return CreditCard;
      default: return Wallet;
    }
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'cash': return 'text-emerald-500 bg-emerald-50';
      case 'mobile': return 'text-sky-500 bg-sky-50';
      case 'card': return 'text-purple-500 bg-purple-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const columns = [
    {
      key: 'receipt_number',
      label: 'Receipt',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0">
            <Receipt size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{row.receipt_number}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {format(new Date(row.created_at), 'HH:mm')}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'customer',
      label: 'Customer & Job',
      render: (row) => (
        <div>
          <p className="font-black text-slate-900 text-sm mb-0.5">{row.customers?.full_name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {row.jobs?.job_number}
          </p>
        </div>
      )
    },
    {
      key: 'amount_paid',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <div className="text-right">
          <p className="font-black text-[#d34932] text-sm">{formatCurrency(row.amount_paid)}</p>
          {row.amount_due > row.amount_paid && (
            <p className="text-[9px] font-bold text-rose-500">
              Due: {formatCurrency(row.amount_due - row.amount_paid)}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (row) => {
        const Icon = getMethodIcon(row.payment_method);
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
            getMethodColor(row.payment_method)
          )}>
            <Icon size={10} />
            {row.payment_method.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar size={12} className="text-slate-400" />
          <span className="font-bold text-xs">{formatDate(row.created_at, 'dd MMM yyyy')}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.payment_status} />
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal('receiptModal', row);
          }}
          className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-xl transition-all"
        >
          <FileText size={14} />
        </button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <CreditCard size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Payments
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching transaction records...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 mb-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <CreditCard size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <DollarSign size={14} /> Financial Records
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Payment <span className="text-[#d34932]">History</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Track transactions, monitor revenue, and manage financial records.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20 flex items-center gap-2"
              >
                <Printer size={14} />
                Print
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-[#d34932] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isSecretary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
                <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
                  {formatCurrency(todayRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">This Month</p>
                <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
                  {formatCurrency(monthRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
                <Calendar size={20} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Transaction</p>
                <p className="text-2xl font-black text-slate-900 group-hover:text-purple-500 transition-colors">
                  {formatCurrency(avgTransaction)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
                <Receipt size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
            <h3 className="text-sm font-black text-slate-900 mb-4">Payment Methods</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(methodBreakdown || {}).map(([method, amount]) => {
                const Icon = getMethodIcon(method);
                return (
                  <div key={method} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={cn("p-2 rounded-lg", getMethodColor(method))}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {method.replace('_', ' ')}
                      </p>
                      <p className="text-sm font-black text-slate-900">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Transactions
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by receipt, customer or job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Payment Method
            </label>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>
                  {method === 'all' ? 'All Methods' : method.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-end">
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Transactions
              </p>
              <p className="text-sm font-black text-slate-900">
                {filteredPayments?.length || 0} records
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredPayments?.length > 0 ? (
          <DataTable 
            columns={columns} 
            data={filteredPayments || []}
            onRowClick={(row) => openModal('receiptModal', row)}
          />
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <CreditCard size={32} className="text-[#d34932]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No payments found</h3>
            <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
              {searchTerm || filterMethod !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'Payment records will appear here once transactions are processed'}
            </p>
            {(searchTerm || filterMethod !== 'all' || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterMethod('all');
                  setFilterStatus('all');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                <RefreshCw size={14} /> Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      <ReceiptModal
        isOpen={modals.receiptModal}
        onClose={() => closeModal('receiptModal')}
        payment={selectedItem}
        job={selectedItem?.jobs}
      />
    </div>
  );
};

export default PaymentsPage;