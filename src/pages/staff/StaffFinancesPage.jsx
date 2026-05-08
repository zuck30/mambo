import React, { useState, useMemo } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStaff } from '../../hooks/useStaff';
import { useExpenses } from '../../hooks/useExpenses';
import { useReports } from '../../hooks/useReports';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { cn, formatDate, formatCurrency } from '../../lib/utils';
import { startOfMonth, endOfMonth, differenceInDays, addDays, isBefore, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const StaffFinancesPage = () => {
  const { staff, isLoading: isLoadingStaff, paySalary } = useStaff();
  const { expenses, isLoading: isLoadingExpenses } = useExpenses();
  const { revenueStats, isLoading: isLoadingReports } = useReports(
    startOfMonth(new Date()).toISOString(),
    endOfMonth(new Date()).toISOString()
  );

  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = isLoadingStaff || isLoadingExpenses || isLoadingReports;

  // Calculate finances for each staff member
  const staffFinances = useMemo(() => {
    if (!staff || !expenses) return [];

    return staff.map(member => {
      // Find expenses linked to this staff that are of category 'Salary'
      // and occurred after their last_salary_paid_at
      const lastPaidDate = member.last_salary_paid_at ? parseISO(member.last_salary_paid_at) : startOfMonth(new Date());

      const relevantExpenses = expenses.filter(e =>
        e.staff_id === member.id &&
        e.category === 'Salary' &&
        parseISO(e.expense_date) >= lastPaidDate
      );

      const totalDeductions = relevantExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const baseSalary = Number(member.salary || 0);
      const remainingSalary = Math.max(0, baseSalary - totalDeductions);

      // Check if payment is near (assuming monthly payment, 30 days after last payment or 1st of month)
      const nextPaymentDate = addDays(lastPaidDate, 30);
      const daysToPayment = differenceInDays(nextPaymentDate, new Date());
      const isNearPayment = daysToPayment <= 7 && daysToPayment >= 0;

      return {
        ...member,
        totalDeductions,
        remainingSalary,
        isNearPayment,
        daysToPayment,
        relevantExpenses
      };
    });
  }, [staff, expenses]);

  const filteredStaffFinances = staffFinances.filter(s =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Business Worth / Money Movement (MTD)
  const totalIn = revenueStats?.reduce((sum, r) => sum + Number(r.amount_paid), 0) || 0;

  const mtdExpenses = useMemo(() => {
    if (!expenses) return [];
    const start = startOfMonth(new Date());
    return expenses.filter(e => parseISO(e.expense_date) >= start);
  }, [expenses]);

  const totalOut = mtdExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netMovement = totalIn - totalOut;

  // Insights & Recommendations
  const insights = useMemo(() => {
    const list = [];
    if (totalOut > totalIn) {
      list.push({
        type: 'warning',
        text: 'Expenses are currently exceeding revenue this month. Consider reviewing overhead costs.',
        icon: AlertCircle
      });
    } else if (totalIn > 0) {
      const margin = ((totalIn - totalOut) / totalIn) * 100;
      if (margin < 20) {
        list.push({
          type: 'info',
          text: `Profit margin is tight (${margin.toFixed(1)}%). Look for opportunities to upsell high-margin services.`,
          icon: Lightbulb
        });
      } else {
        list.push({
          type: 'success',
          text: `Healthy profit margin of ${margin.toFixed(1)}% detected. Business is performing well.`,
          icon: CheckCircle2
        });
      }
    }

    const highDeductionStaff = staffFinances.filter(s => s.totalDeductions > s.salary * 0.5);
    if (highDeductionStaff.length > 0) {
      list.push({
        type: 'warning',
        text: `${highDeductionStaff.length} staff members have advanced more than 50% of their salary.`,
        icon: AlertCircle
      });
    }

    const dueSoon = staffFinances.filter(s => s.isNearPayment);
    if (dueSoon.length > 0) {
      list.push({
        type: 'info',
        text: `${dueSoon.length} staff salaries are due within the next 7 days. Ensure liquidity for payroll.`,
        icon: Calendar
      });
    }

    return list;
  }, [totalIn, totalOut, staffFinances]);

  const handlePaySalary = (memberId) => {
    if (window.confirm('Mark salary as paid for this month? This will reset deductions tracking.')) {
      paySalary.mutate(memberId);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Staff Name', 'Role', 'Base Salary', 'Deductions', 'Remaining Salary', 'Last Paid'];
    const csvData = staffFinances.map(s => [
      `"${s.full_name}"`,
      `"${s.role}"`,
      s.salary,
      s.totalDeductions,
      s.remainingSalary,
      s.last_salary_paid_at ? `"${formatDate(s.last_salary_paid_at, 'yyyy-MM-dd')}"` : '"Never"'
    ].join(','));

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `staff_finances_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`);
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <DollarSign size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Wallet size={14} /> Financial Management
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Staff <span className="text-[#d34932]">Finances</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Manage salaries, track deductions, and monitor business liquidity.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportCSV}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20 flex items-center gap-2"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Worth / Money Movement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Money In (MTD)</p>
            <p className="text-3xl font-black text-emerald-600 group-hover:scale-105 transition-transform">
              {formatCurrency(totalIn)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Money Out (MTD)</p>
            <p className="text-3xl font-black text-rose-500 group-hover:scale-105 transition-transform">
              {formatCurrency(totalOut)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-500">
            <ArrowDownRight size={24} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Movement / Worth</p>
            <p className={cn(
              "text-3xl font-black group-hover:scale-105 transition-transform",
              netMovement >= 0 ? "text-slate-900" : "text-[#d34932]"
            )}>
              {formatCurrency(netMovement)}
            </p>
          </div>
          <div className={cn(
            "p-4 rounded-2xl",
            netMovement >= 0 ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-[#d34932]"
          )}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Lightbulb size={18} className="text-amber-500" />
          Business Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className={cn(
              "p-4 rounded-xl border flex items-start gap-3",
              insight.type === 'warning' ? "bg-rose-50 border-rose-100 text-rose-700" :
              insight.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
              "bg-blue-50 border-blue-100 text-blue-700"
            )}>
              <insight.icon size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">{insight.text}</p>
            </div>
          ))}
          {insights.length === 0 && (
            <p className="text-xs text-slate-400 font-medium italic">No immediate financial recommendations at this time.</p>
          )}
        </div>
      </div>

      {/* Staff Finances Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <Users size={18} className="text-[#d34932]" />
            Staff Payroll & Deductions
          </h3>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-[#d34932] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Base Salary</th>
                <th className="px-6 py-4 text-right text-rose-500">Deductions</th>
                <th className="px-6 py-4 text-right">Remaining</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaffFinances.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-600 text-xs">
                        {s.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{s.full_name}</p>
                        {s.last_salary_paid_at && (
                          <p className="text-[10px] text-slate-400 font-bold">Paid: {formatDate(s.last_salary_paid_at, 'MMM dd, yyyy')}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200">
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-slate-900">{formatCurrency(s.salary)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-rose-500">-{formatCurrency(s.totalDeductions)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-900">{formatCurrency(s.remainingSalary)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {s.isNearPayment ? (
                      <div className="flex items-center gap-1 text-amber-600 animate-pulse">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Due in {s.daysToPayment} days</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Up to date</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handlePaySalary(s.id)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d34932] transition-colors"
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStaffFinances.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-bold">
              No staff financial records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffFinancesPage;
