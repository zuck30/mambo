import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, 
} from 'recharts';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  FileText, 
  Filter,
  RefreshCw,
  ChevronRight,
  DollarSign,
  Clock,
  Award,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Printer,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import StatCard from '../../components/ui/StatCard';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../hooks/useReports';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { TableSkeleton, CardSkeleton } from '../../components/ui/LoadingSpinner';
import { subDays, startOfMonth, endOfMonth, format, differenceInDays } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import AnalyticsReportPDF from './AnalyticsReportPDF';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [activeChart, setActiveChart] = useState('revenue');
  const [reportType, setReportType] = useState('daily');

  const {
    revenueStats,
    serviceStats,
    customerStats,
    inventoryStats,
    expenseStats,
    jobStats,
    isLoading
  } = useReports(
    new Date(dateRange.start).toISOString(),
    new Date(dateRange.end + 'T23:59:59').toISOString()
  );

  const COLORS = ['#d34932', '#3B82F6', '#0F172A', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];

  // Quick date ranges
  const setQuickRange = (range) => {
    const today = new Date();
    let start, end;
    
    switch(range) {
      case 'today':
        start = format(today, 'yyyy-MM-dd');
        end = format(today, 'yyyy-MM-dd');
        break;
      case 'week':
        start = format(subDays(today, 7), 'yyyy-MM-dd');
        end = format(today, 'yyyy-MM-dd');
        break;
      case 'month':
        start = format(startOfMonth(today), 'yyyy-MM-dd');
        end = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'quarter':
        start = format(subDays(today, 90), 'yyyy-MM-dd');
        end = format(today, 'yyyy-MM-dd');
        break;
      default:
        return;
    }
    setDateRange({ start, end });
  };

  // Calculate metrics
  const totalRevenue = revenueStats?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
  const totalExpenses = expenseStats?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const totalJobs = jobStats?.length || 0;
  const avgOrderValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;
  const uniqueCustomers = new Set(revenueStats?.map(r => r.customer_id)).size || 0;
  
  const inventoryValue = inventoryStats?.items?.reduce((sum, i) => sum + (Number(i.current_stock) * Number(i.unit_cost || 0)), 0) || 0;
  const lowStockItems = inventoryStats?.items?.filter(i => Number(i.current_stock) <= Number(i.minimum_stock)) || [];

  // Calculate Growth (Removed static placeholder)
  const revenueGrowth = 0;

  // Revenue & Expense by Day
  const dailyData = {};
  revenueStats?.forEach(p => {
    const date = format(new Date(p.created_at), 'dd MMM');
    if (!dailyData[date]) dailyData[date] = { date, revenue: 0, expenses: 0 };
    dailyData[date].revenue += Number(p.amount_paid);
  });
  expenseStats?.forEach(e => {
    const date = format(new Date(e.expense_date), 'dd MMM');
    if (!dailyData[date]) dailyData[date] = { date, revenue: 0, expenses: 0 };
    dailyData[date].expenses += Number(e.amount);
  });
  const revenueChartData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Service Popularity
  const servicesCount = serviceStats?.reduce((acc, curr) => {
    const name = curr.services?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const serviceChartData = Object.entries(servicesCount || {}).map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value).slice(0, 5);

  // Job status distribution (Funnel)
  const statusCounts = jobStats?.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  const statusChartData = [
    { name: 'Waiting', value: statusCounts?.waiting || 0 },
    { name: 'In Progress', value: statusCounts?.in_progress || 0 },
    { name: 'Done', value: statusCounts?.done || 0 },
    { name: 'Cancelled', value: statusCounts?.cancelled || 0 },
  ];

  // Inventory Stock Distribution
  const inventoryChartData = inventoryStats?.items?.slice(0, 8).map(item => ({
    name: item.name,
    stock: Number(item.current_stock),
    min: Number(item.minimum_stock)
  })) || [];

  const dateRangeText = `${format(new Date(dateRange.start), 'dd MMM yyyy')} - ${format(new Date(dateRange.end), 'dd MMM yyyy')}`;
  const daysSelected = differenceInDays(new Date(dateRange.end), new Date(dateRange.start)) + 1;

  // PDF Print Handler
  const handlePrint = async () => {
    if (!jobStats || jobStats.length === 0) {
      toast.error('No data to print');
      return;
    }
    try {
      const blob = await pdf(
        <AnalyticsReportPDF
          revenueStats={revenueStats}
          serviceStats={serviceStats}
          customerStats={customerStats}
          inventoryStats={inventoryStats}
          expenseStats={expenseStats}
          jobStats={jobStats}
          dateRangeText={dateRangeText}
          generatedAt={new Date()}
          metrics={{
            totalRevenue,
            totalExpenses,
            totalJobs,
            avgOrderValue,
            uniqueCustomers,
            inventoryValue,
            lowStockCount: lowStockItems.length
          }}
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

  // PDF Download Handler
  const handleExportPDF = async () => {
    if (!jobStats || jobStats.length === 0) {
      toast.error('No data to export');
      return;
    }
    try {
      const blob = await pdf(
        <AnalyticsReportPDF
          revenueStats={revenueStats}
          serviceStats={serviceStats}
          customerStats={customerStats}
          inventoryStats={inventoryStats}
          expenseStats={expenseStats}
          jobStats={jobStats}
          dateRangeText={dateRangeText}
          generatedAt={new Date()}
          metrics={{
            totalRevenue,
            totalExpenses,
            totalJobs,
            avgOrderValue,
            uniqueCustomers,
            inventoryValue,
            lowStockCount: lowStockItems.length
          }}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_report_${dateRange.start}_to_${dateRange.end}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!jobStats || jobStats.length === 0) {
      toast.error('No data to export');
      return;
    }
    // Comprehensive denormalized data
    const headers = [
      'Job Date', 'Job Number', 'Customer Name', 'Plate Number', 'Vehicle',
      'Status', 'Total Services', 'Total Amount', 'Staff Assigned',
      'Created At', 'Completed At', 'Cycle Time (Mins)', 'Inventory_Health_Score'
    ];

    const csvData = jobStats.map(j => {
      const cycleTime = j.completed_at && j.created_at
        ? Math.round((new Date(j.completed_at) - new Date(j.created_at)) / 60000)
        : 'N/A';

      const subtotal = j.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0) || 0;

      return [
        format(new Date(j.created_at), 'yyyy-MM-dd'),
        j.job_number,
        `"${j.customers?.full_name || 'N/A'}"`,
        j.cars?.plate_number || 'N/A',
        `"${j.cars?.make || ''} ${j.cars?.model || ''}"`,
        j.status,
        j.job_services?.length || 0,
        subtotal,
        `"${j.profiles?.full_name || 'Unassigned'}"`,
        format(new Date(j.created_at), 'yyyy-MM-dd HH:mm'),
        j.completed_at ? format(new Date(j.completed_at), 'yyyy-MM-dd HH:mm') : 'N/A',
        cycleTime,
        lowStockItems.length > 0 ? 'NEEDS ATTENTION' : 'GOOD'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `operational_report_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <TrendingUp size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Reports
            </div>
            <p className="text-lg text-slate-400 font-bold">Generating analytics data...</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          <div className="h-[400px] bg-white border border-slate-200 rounded-lg shadow-sm animate-pulse" />
          <div className="h-[400px] bg-white border border-slate-200 rounded-lg shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <TrendingUp size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <TrendingUp size={14} /> Business Intelligence
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Reports & <span className="text-[#d34932]">Analytics</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Comprehensive insights into your business performance and trends.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all border border-white/20 flex items-center gap-2"
              >
                <Printer size={14} />
                Print PDF
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-[#d34932] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
              >
                <Download size={14} />
                Download PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-slate-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2"
              >
                <FileText size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <Calendar size={20} className="text-[#d34932]" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{dateRangeText}</p>
              <p className="text-[10px] text-slate-400 font-bold">{daysSelected} days selected</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['today', 'week', 'month', 'quarter'].map(range => (
              <button
                key={range}
                onClick={() => setQuickRange(range)}
                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d34932] hover:text-white transition-all"
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none"
              />
              <span className="text-slate-400 font-black">—</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-[9px] font-bold text-emerald-600 mt-1">
              Live Revenue Analytics
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Expenses</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-rose-500 transition-colors">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inventory Value</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {formatCurrency(inventoryValue)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">
              {lowStockItems.length}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        {/* Revenue vs Expenses Trend Chart */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-1">Financial Performance</h3>
              <p className="text-[10px] text-slate-400 font-bold italic">Revenue vs Expenses over time</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d34932" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#d34932" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 'bold' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '20px' }} />
                <Area name="Revenue" type="monotone" dataKey="revenue" stroke="#d34932" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area name="Expenses" type="monotone" dataKey="expenses" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Stock Levels Chart */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-1">Inventory Resources</h3>
              <p className="text-[10px] text-slate-400 font-bold italic">Stock levels vs Minimum requirements</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} width={100} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 'bold' }} />
                <Bar name="Current Stock" dataKey="stock" fill="#d34932" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar name="Min. Required" dataKey="min" fill="#E2E8F0" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#d34932]" />
              <span className="text-[10px] font-black text-slate-600 uppercase">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-600 uppercase">Minimum</span>
            </div>
          </div>
        </div>

        {/* Workflow Pipeline Chart */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-1">Operational Pipeline</h3>
              <p className="text-[10px] text-slate-400 font-bold italic">Workflow status distribution</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={50}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services Chart */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-1">Top Services</h3>
              <p className="text-[10px] text-slate-400 font-bold italic">Most popular service offerings</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                  {serviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {serviceChartData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
                <span className="text-[10px] font-black text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Award size={20} className="text-[#d34932]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Top Customers</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic">Highest lifetime value clients</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/reports/top-customers')}
                className="text-[10px] font-black text-[#d34932] uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-center">Visits</th>
                  <th className="px-6 py-4">Last Visit</th>
                  <th className="px-6 py-4 text-right">Total Spent</th>
                  <th className="px-6 py-4 text-center">Loyalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerStats?.slice(0, 10).map((c, i) => (
                  <tr key={c.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {i < 3 ? (
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm",
                            i === 0 ? "bg-amber-100 text-amber-600" :
                            i === 1 ? "bg-slate-200 text-slate-600" :
                            "bg-orange-100 text-orange-600"
                          )}>
                            {i + 1}
                          </div>
                        ) : (
                          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black text-sm text-slate-500">
                            {i + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0 font-black text-sm">
                          {c.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{c.full_name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ID: #{c.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-slate-900">{c.total_visits || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={12} className="text-slate-400" />
                        <span className="font-bold text-xs">{formatDate(c.updated_at, 'dd MMM yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-black text-[#d34932]">{formatCurrency(c.total_spent || 0)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                        (c.total_visits || 0) > 20 ? "bg-amber-50 text-amber-600 border border-amber-200" :
                        (c.total_visits || 0) > 5 ? "bg-slate-100 text-slate-600 border border-slate-200" :
                        "bg-orange-50 text-orange-600 border border-orange-200"
                      )}>
                        {(c.total_visits || 0) > 20 ? 'Gold' : (c.total_visits || 0) > 5 ? 'Silver' : 'Bronze'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;