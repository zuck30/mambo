import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Car,
  Users,
  ListOrdered,
  ArrowRight,
  Plus,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  Wrench,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend as RechartsLegend
} from 'recharts';
import { motion } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/ui/StatCard';
import AppCard from '../../components/ui/AppCard';
import AIInsightsPanel from '../../components/dashboard/AIInsightsPanel';
import { useJobs } from '../../hooks/useJobs';
import { usePayments } from '../../hooks/usePayments';
import { useCustomers } from '../../hooks/useCustomers';
import { useInventory } from '../../hooks/useInventory';
import { useExpenses } from '../../hooks/useExpenses';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton, CardSkeleton } from '../../components/ui/LoadingSpinner';
import logo from '../../assets/garidesk.png';
import { format } from 'date-fns';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, isSecretary } = useAuth();

  React.useEffect(() => {
    if (profile?.role === 'staff') {
      navigate('/queue', { replace: true });
    }
  }, [profile, navigate]);

  const { jobs, isLoading: jobsLoading } = useJobs();
  const { payments, isLoading: paymentsLoading } = usePayments();
  const { customers, isLoading: customersLoading } = useCustomers();
  const { items: inventoryItems } = useInventory();
  const { expenses } = useExpenses();

  if (jobsLoading || paymentsLoading || customersLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <Car size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <Clock size={14} className="animate-spin" /> Loading Dashboard
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching operational data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Stats Calculations
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayPayments = payments?.filter(p => format(new Date(p.created_at), 'yyyy-MM-dd') === today) || [];
  const todayRevenue = todayPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const todayJobs = jobs?.filter(j => format(new Date(j.created_at), 'yyyy-MM-dd') === today) || [];
  const activeQueue = jobs?.filter(j => j.status === 'waiting' || j.status === 'in_progress') || [];
  const newCustomersToday = customers?.filter(c => format(new Date(c.created_at), 'yyyy-MM-dd') === today) || [];

  const lowStockCount = inventoryItems?.filter(i => Number(i.current_stock) < Number(i.minimum_stock)).length || 0;

  // Real Data for 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return format(d, 'yyyy-MM-dd');
  });

  const revenueData = last7Days.map(date => {
    const dayPayments = payments?.filter(p => format(new Date(p.created_at), 'yyyy-MM-dd') === date) || [];
    const dayExpenses = expenses?.filter(e => e.expense_date === date) || [];
    return {
      day: format(new Date(date), 'EEE'),
      revenue: dayPayments.reduce((sum, p) => sum + Number(p.amount_paid), 0),
      expenses: dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
    };
  });

  // Workflow Status Distribution
  const statusCounts = jobs?.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  const workflowData = [
    { name: 'Waiting', value: statusCounts?.waiting || 0 },
    { name: 'In Progress', value: statusCounts?.in_progress || 0 },
    { name: 'Done', value: statusCounts?.done || 0 },
  ];

  // Service Distribution from Jobs
  const serviceCounts = {};
  jobs?.forEach(j => {
    j.job_services?.forEach(js => {
      const name = js.services?.name || 'Standard Service';
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    });
  });
  const serviceData = Object.entries(serviceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Recommendations Logic
  const recommendations = [];
  inventoryItems?.forEach(item => {
    if (Number(item.current_stock) < Number(item.minimum_stock)) {
      recommendations.push({
        type: 'inventory',
        title: 'Inventory Alert',
        message: `Stock level for ${item.name} is ${item.current_stock} ${item.unit}. Minimum required is ${item.minimum_stock}.`,
        action: () => navigate('/inventory'),
        priority: 'urgent'
      });
    }
  });

  const stuckJobs = jobs?.filter(j =>
    (j.status === 'waiting' || j.status === 'in_progress') &&
    (new Date() - new Date(j.updated_at)) > (4 * 3600 * 1000) // 4 hours
  ) || [];

  if (stuckJobs.length > 0) {
    recommendations.push({
      type: 'workflow',
      title: 'MUHIMU',
      message: `Kazi ${stuckJobs.length} zimekwama kwa zaidi ya masaa 4.`,
      action: () => navigate('/queue'),
      priority: 'high'
    });
  }

  const unpaidJobs = payments?.filter(p => p.payment_status === 'pending' || p.payment_status === 'partial') || [];
  if (unpaidJobs.length > 5 && !isSecretary) {
    recommendations.push({
      type: 'financial',
      title: 'Collection Required',
      message: `There are ${unpaidJobs.length} pending or partial payments. Cash flow may be affected.`,
      action: () => navigate('/payments'),
      priority: 'normal'
    });
  }

  const COLORS = ['#d34932', '#3B82F6', '#0F172A', '#10B981', '#8B5CF6'];

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner*/}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Wrench size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <TrendingUp size={14} /> DASHBOARD
              </div>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={logo} 
                  alt="GariDesk" 
                  className="h-16 w-16 object-cover rounded-xl shadow-lg border-2 border-white/10" 
                />
                <div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                    Gari<span className="text-[#d34932]">Desk</span>
                  </h2>
                </div>
              </div>
              <p className="text-lg text-slate-400 font-bold">
                Monitor real-time metrics, track fleet status, and optimize service delivery.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/queue')}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Launch New Job
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {!isSecretary && <AIInsightsPanel />}

      {/* Stats Summary Cards */}
      <div className={cn(
        "grid gap-1 mb-1",
        isSecretary ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"
      )}>
        {!isSecretary && (
          <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
              <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
                {formatCurrency(todayRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Deployments</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {todayJobs.length}
            </p>
            <p className="text-[9px] font-bold text-sky-600 mt-1 flex items-center gap-1">
              <Clock size={10} /> today
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <ListOrdered size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet in Queue</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">
              {activeQueue.length}
            </p>
            <p className="text-[9px] font-bold text-amber-600 mt-1">Awaiting service</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500 group-hover:scale-110 transition-transform">
            <Car size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">New Clients</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {newCustomersToday.length}
            </p>
            <p className="text-[9px] font-bold text-emerald-600 mt-1">Registered today</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <Users size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-1">
          {/* Revenue & Expenses Chart Card */}
          {!isSecretary && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-1">Financial Health</h3>
                  <p className="text-[10px] text-slate-400 font-bold italic">Revenue vs Expenses (Last 7 Days)</p>
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      cursor={{ fill: '#F8FAFC' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}
                    />
                    <RechartsLegend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '10px' }} />
                    <Bar name="Revenue" dataKey="revenue" fill="#d34932" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar name="Expenses" dataKey="expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recent Activity Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-1">History</h3>
                <p className="text-[10px] text-slate-400 font-bold italic">Recently processed vehicles</p>
              </div>
              <button
                onClick={() => navigate('/queue')}
                className="group text-[10px] font-black text-[#d34932] uppercase tracking-widest flex items-center hover:text-slate-900 transition-colors"
              >
                Full Intel <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {jobs?.filter(j => j.status === 'done').slice(0, 5).map((job) => (
                    <tr key={job.id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:text-white transition-all">
                            <Car size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1.5">{job.customers?.full_name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                              {job.cars?.plate_number}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Specialist</p>
                        <p className="text-[11px] font-bold text-slate-700">{job.profiles?.full_name}</p>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={job.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!isSecretary && (
                          <p className="text-sm font-black text-slate-900">
                            {formatCurrency(job.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0))}
                          </p>
                        )}
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {formatDate(job.completed_at || job.created_at, 'HH:mm')}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-1">
          {/* Intelligence Panel */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-[#d34932]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">System Recommendations</h3>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.length > 0 ? recommendations.map((rec, i) => (
                <div
                  key={i}
                  onClick={rec.action}
                  className={cn(
                    "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                    rec.priority === 'urgent' ? "bg-rose-50 border-rose-100" :
                    rec.priority === 'high' ? "bg-orange-50 border-orange-100" :
                    "bg-blue-50 border-blue-100"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className={cn(
                      rec.priority === 'urgent' ? "text-rose-500" :
                      rec.priority === 'high' ? "text-orange-500" :
                      "text-blue-500"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{rec.title}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed">{rec.message}</p>
                </div>
              )) : (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">All systems optimal</p>
                </div>
              )}
            </div>
          </div>

          {/* Workflow Pipeline Chart */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 mb-6 text-center">MTIRIRIKO WA KAZI</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workflowData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 800 }} width={80} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {workflowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Distribution Card */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-900 mb-6 text-center">MGAWANYO WA HUDUMA</h3>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData.length > 0 ? serviceData : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0', 
                      fontSize: '10px', 
                      fontWeight: 'bold' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {serviceData.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125" 
                      style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                    />
                    <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
