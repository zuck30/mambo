import React, { useState } from 'react';
import {
  Plus,
  Search,
  TrendingDown,
  Filter,
  RefreshCw,
  Calendar,
  DollarSign,
  Tag,
  Users,
  ChevronRight,
  MoreVertical,
  ArrowDownCircle,
  Clock,
  Package,
  Zap,
  Wrench,
  Megaphone,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import { useExpenses } from '../../hooks/useExpenses';
import { useStaff } from '../../hooks/useStaff';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { cn, formatDate, formatCurrency } from '../../lib/utils';
import DataTable from '../../components/ui/DataTable';
import BottomSheet from '../../components/ui/BottomSheet';
import ExpenseForm from '../../components/forms/ExpenseForm';
import { useUIStore } from '../../store/uiStore';

const ExpensesPage = () => {
  const { expenses, isLoading, createExpense } = useExpenses();
  const { staff } = useStaff();
  const { modals, openModal, closeModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Supplies', 'Utilities', 'Salary', 'Maintenance', 'Marketing', 'Other'];

  const filteredExpenses = expenses?.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Supplies': return Package;
      case 'Utilities': return Zap;
      case 'Salary': return Users;
      case 'Maintenance': return Wrench;
      case 'Marketing': return Megaphone;
      default: return MoreHorizontal;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Supplies': return 'text-sky-500 bg-sky-50';
      case 'Utilities': return 'text-amber-500 bg-amber-50';
      case 'Salary': return 'text-emerald-500 bg-emerald-50';
      case 'Maintenance': return 'text-purple-500 bg-purple-50';
      case 'Marketing': return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const columns = [
    {
      key: 'expense_date',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar size={12} className="text-slate-400" />
          <span className="font-bold text-xs">{formatDate(row.expense_date, 'dd MMM yyyy')}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => {
        const Icon = getCategoryIcon(row.category);
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
            getCategoryColor(row.category)
          )}>
            <Icon size={10} />
            {row.category}
          </span>
        );
      }
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <div>
          <p className="font-black text-slate-900 text-sm mb-0.5">{row.description}</p>
          {row.reference_number && (
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Ref: {row.reference_number}
            </p>
          )}
        </div>
      )
    },
    {
      key: 'staff',
      label: 'Staff Link',
      render: (row) => {
        if (!row.staff_id) return <span className="text-slate-300">—</span>;
        const member = staff?.find(s => s.id === row.staff_id);
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black">
              {member?.full_name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold text-slate-600">{member?.full_name}</span>
          </div>
        );
      }
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (row) => (
        <span className="font-black text-[#d34932] text-sm">{formatCurrency(row.amount)}</span>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <TrendingDown size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Expenses
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching expense records...</p>
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
          <TrendingDown size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <ArrowDownCircle size={14} /> Expenditure Tracking
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Business <span className="text-[#d34932]">Expenses</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Monitor overheads, track supplies, and manage salary advances.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('expenseForm')}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Record Expense
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Period Expense</p>
            <p className="text-3xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Records Found</p>
            <p className="text-3xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {filteredExpenses?.length || 0}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Category</p>
            <p className="text-xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors uppercase">
              {filteredExpenses?.length > 0 ? filteredExpenses[0].category : 'N/A'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <Tag size={24} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredExpenses?.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredExpenses || []}
          />
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <TrendingDown size={32} className="text-[#d34932]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">No expenses recorded</h3>
            <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
              Start tracking your business expenditures to gain financial insights.
            </p>
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={modals.expenseForm}
        onClose={() => closeModal('expenseForm')}
        title="Record Business Expense"
      >
        <ExpenseForm
          onSubmit={async (data) => {
            await createExpense.mutateAsync(data);
            closeModal('expenseForm');
          }}
          loading={createExpense.isPending}
          staff={staff}
        />
      </BottomSheet>
    </div>
  );
};

export default ExpensesPage;
