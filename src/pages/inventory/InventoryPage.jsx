import React, { useState } from 'react';
import { Package, Plus, ArrowUpRight, ArrowDownLeft, AlertCircle, Search, History, TrendingDown, TrendingUp, Boxes, RefreshCw, Filter, ChevronRight, Loader2, Grid, List, Zap, Droplet, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import { useInventory } from '../../hooks/useInventory';
import { useJobs } from '../../hooks/useJobs';
import DataTable from '../../components/ui/DataTable';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import BottomSheet from '../../components/ui/BottomSheet';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import InventoryItemForm from '../../components/forms/InventoryItemForm';
import { useUIStore } from '../../store/uiStore';
import HologramItemCard from '../../components/ui/HologramItemCard';

const InventoryPage = () => {
  const { items, movements, consumptionInsights, isLoading, isLoadingMovements, recordMovement, createItem, updateItem } = useInventory();
  const { jobs } = useJobs();
  const { modals, openModal, closeModal, selectedItem: uiSelectedItem } = useUIStore();
  const [activeTab, setActiveTab] = useState('stock');
  const [viewMode, setViewMode] = useState('hologram');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveType, setMoveType] = useState('in');
  const [movementItem, setMovementItem] = useState(null);
  const [moveQty, setMoveQty] = useState('');
  const [moveNotes, setMoveNotes] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getStockStatus = (current, min) => {
    if (current < min) return { label: 'Critical', color: 'bg-rose-50 text-rose-600 border-rose-200' };
    if (current < min * 2) return { label: 'Low', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    return { label: 'Good', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  };

  // Filter items
  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'critical') return matchesSearch && Number(item.current_stock) < Number(item.minimum_stock);
    if (filterType === 'low') return matchesSearch && Number(item.current_stock) < Number(item.minimum_stock) * 2;
    return matchesSearch;
  }) || [];

  // Calculate stats
  const totalItems = items?.length || 0;
  const lowStockItems = items?.filter(item => Number(item.current_stock) < Number(item.minimum_stock)) || [];
  const criticalCount = lowStockItems.length;
  const totalValue = items?.reduce((sum, item) => sum + (Number(item.current_stock) * Number(item.unit_cost || 0)), 0) || 0;
  
  const todayMovements = movements?.filter(m => {
    const today = new Date().toDateString();
    return new Date(m.created_at).toDateString() === today;
  }) || [];
  
  const todayIn = todayMovements.filter(m => m.movement_type === 'in').reduce((sum, m) => sum + m.quantity, 0);
  const todayOut = todayMovements.filter(m => m.movement_type === 'out').reduce((sum, m) => sum + m.quantity, 0);

  const itemColumns = [
    { 
      key: 'name', 
      label: 'Item Details', 
      sortable: true, 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0">
            <Package size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm mb-0.5">{row.name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.unit}</p>
          </div>
        </div>
      )
    },
    {
      key: 'current_stock',
      label: 'Stock Level',
      sortable: true,
      render: (row) => (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900">{row.current_stock} {row.unit}</span>
            <span className="text-[9px] font-bold text-slate-400">Min: {row.minimum_stock}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                Number(row.current_stock) < Number(row.minimum_stock) 
                  ? "bg-rose-500" 
                  : Number(row.current_stock) < Number(row.minimum_stock) * 2
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(100, (Number(row.current_stock) / (Number(row.minimum_stock) * 3)) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const status = getStockStatus(Number(row.current_stock), Number(row.minimum_stock));
        return (
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
            status.color
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              status.label === 'Critical' ? 'bg-rose-500' : 
              status.label === 'Low' ? 'bg-amber-500' : 'bg-emerald-500'
            )} />
            {status.label}
          </span>
        );
      }
    },
    {
      key: 'unit_cost',
      label: 'Unit Cost',
      render: (row) => (
        <span className="font-black text-slate-700">
          {row.unit_cost ? `TSh ${Number(row.unit_cost).toLocaleString()}` : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMovementItem(row); setMoveType('in'); setShowMoveModal(true); }}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all group"
            title="Stock In"
          >
            <ArrowUpRight size={16} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMovementItem(row); setMoveType('out'); setShowMoveModal(true); }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
            title="Stock Out"
          >
            <ArrowDownLeft size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )
    }
  ];

  const movementColumns = [
    {
      key: 'created_at',
      label: 'Date & Time',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Package size={12} className="text-slate-400" />
          <span className="font-bold text-xs">{format(new Date(row.created_at), 'dd MMM, HH:mm')}</span>
        </div>
      )
    },
    { 
      key: 'item', 
      label: 'Item', 
      render: (row) => (
        <div>
          <p className="font-black text-slate-900 text-sm">{row.inventory_items?.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">{row.inventory_items?.unit}</p>
        </div>
      )
    },
    {
      key: 'movement_type',
      label: 'Type',
      render: (row) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
          row.movement_type === 'in' 
            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
            : "bg-rose-50 text-rose-600 border-rose-200"
        )}>
          {row.movement_type === 'in' ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
          {row.movement_type}
        </span>
      )
    },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      render: (row) => (
        <span className="font-black text-slate-900">{row.quantity}</span>
      )
    },
    { 
      key: 'notes', 
      label: 'Notes', 
      render: (row) => (
        <span className="text-xs text-slate-400 font-medium italic">{row.notes || '—'}</span>
      )
    },
  ];

  const handleRecordMovement = async () => {
    if (!moveQty || isNaN(moveQty) || !movementItem) return;
    await recordMovement.mutateAsync({
      item_id: movementItem.id,
      movement_type: moveType,
      quantity: Number(moveQty),
      notes: moveNotes,
      job_id: moveType === 'out' ? selectedJobId : null
    });
    setShowMoveModal(false);
    setMoveQty('');
    setMoveNotes('');
    setSelectedJobId('');
  };

  const onFormSubmit = async (data) => {
    if (uiSelectedItem) {
      await updateItem.mutateAsync({ id: uiSelectedItem.id, ...data });
    } else {
      await createItem.mutateAsync(data);
    }
    closeModal('inventoryItemForm');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <Package size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Inventory
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching stock data...</p>
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const topConsumables = consumptionInsights
    ?.filter(i => i.category === 'Chemicals' || i.category === 'Consumables')
    ?.sort((a, b) => b.totalUsed - a.totalUsed)
    ?.slice(0, 3);

  return (
    <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
          <Boxes size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Package size={14} /> Stock Management
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Inventory <span className="text-[#d34932]">Control</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Track supplies, monitor stock levels, and manage inventory movements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/20 flex">
                <button
                  onClick={() => setViewMode('hologram')}
                  className={cn(
                    "p-2.5 rounded-lg transition-all",
                    viewMode === 'hologram'
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
                onClick={() => openModal('inventoryItemForm')}
                className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Add New Item
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Consumption Insights */}
      {/* {activeTab === 'stock' && consumptionInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-1">
          {topConsumables.map((insight, idx) => (
            <div key={insight.id} className="bg-slate-900 rounded-lg p-5 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                {insight.category === 'Chemicals' ? <FlaskConical size={60} /> : <Droplet size={60} />}
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-black mb-3">{insight.name}</h4>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-2xl font-black italic tracking-tighter">1:{insight.ratio > 0 ? (1/insight.ratio).toFixed(1) : 0}</p>
                    <p className="text-[9px] font-bold text-slate-400  tracking-widest">Ratio (Unit:Vehicles)</p>
                  </div>
                  <div className="pb-1">
                    <p className="text-xs font-black text-emerald-400">{insight.vehicleCount} Vehicles</p>
                    <p className="text-[9px] font-bold text-slate-500 ">Total Usage: {insight.totalUsed} {insight.unit}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {topConsumables.length === 0 && (
             <div className="md:col-span-3 bg-slate-900 rounded-lg p-5 text-white flex items-center justify-center italic text-xs text-slate-400">
               Start recording "Stock Out" with Jobs to see consumption ratios here.
             </div>
          )}
        </div>
      )} */}

      {/* Critical Alert */}
      {criticalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 rounded-lg p-6 mb-1"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-rose-900 mb-1">Critical Stock Alert</h4>
              <p className="text-xs font-bold text-rose-600">
                {criticalCount} item{criticalCount > 1 ? 's are' : ' is'} below minimum stock level. Immediate action required.
              </p>
            </div>
            <ChevronRight size={20} className="text-rose-400" />
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-1">
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-[#d34932] transition-colors">
              {totalItems}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inventory Value</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              TSh {(totalValue / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Stock In</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {todayIn}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <ArrowUpRight size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Stock Out</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-rose-500 transition-colors">
              {todayOut}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition-transform">
            <ArrowDownLeft size={20} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab('stock')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
              activeTab === 'stock' 
                ? "bg-[#d34932] text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Package size={14} />
            Stock Levels
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
              activeTab === 'movements' 
                ? "bg-[#d34932] text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <History size={14} />
            Movement History
          </button>
        </div>
      </div>

      {/* Search and Filters (Stock Tab only) */}
      {activeTab === 'stock' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Search Items
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Filter by Status
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="critical">Critical Stock</option>
                <option value="low">Low Stock</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex items-end">
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Showing Results
                </p>
                <p className="text-sm font-black text-slate-900">
                  {filteredItems.length} items
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className={cn(
        "rounded-lg overflow-hidden",
        viewMode === 'list' || activeTab === 'movements' ? "bg-white border border-slate-200 shadow-sm" : ""
      )}>
        {activeTab === 'stock' ? (
          filteredItems.length > 0 ? (
            viewMode === 'hologram' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => openModal('inventoryItemForm', item)}
                    >
                      <HologramItemCard
                        name={item.name}
                        currentStock={Number(item.current_stock)}
                        unit={item.unit}
                        minimumStock={Number(item.minimum_stock)}
                        category={item.category}
                      />
                      <div className="mt-2 px-4 pb-4 flex items-center justify-between">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setMovementItem(item); setMoveType('in'); setShowMoveModal(true); }}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            Stock In
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMovementItem(item); setMoveType('out'); setShowMoveModal(true); }}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            Stock Out
                          </button>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <DataTable
                columns={itemColumns}
                data={filteredItems}
                onRowClick={(row) => openModal('inventoryItemForm', row)}
              />
            )
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
                <Package size={32} className="text-[#d34932]" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No items found</h3>
              <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'Start adding inventory items to track your stock'}
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
                  onClick={() => openModal('inventoryItemForm')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
                >
                  <Plus size={14} /> Add First Item
                </button>
              )}
            </div>
          )
        ) : (
          isLoadingMovements ? (
            <TableSkeleton />
          ) : movements?.length > 0 ? (
            <DataTable columns={movementColumns} data={movements || []} />
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                <History size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No movement history</h3>
              <p className="text-sm text-slate-400 font-bold">
                Stock movements will appear here once recorded.
              </p>
            </div>
          )
        )}
      </div>

      {/* Item Form Modal */}
      <BottomSheet
        isOpen={modals.inventoryItemForm}
        onClose={() => closeModal('inventoryItemForm')}
        title={uiSelectedItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      >
        <InventoryItemForm
          onSubmit={onFormSubmit}
          initialData={uiSelectedItem}
          loading={createItem.isPending || updateItem.isPending}
        />
      </BottomSheet>

      {/* Movement Modal */}
      <BottomSheet
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setMovementItem(null);
          setMoveQty('');
          setMoveNotes('');
        }}
        title={`Stock ${moveType === 'in' ? 'In' : 'Out'}: ${movementItem?.name}`}
      >
        <div className="space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</span>
              <span className="text-sm font-black text-slate-900">
                {movementItem?.current_stock} {movementItem?.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minimum Stock</span>
              <span className="text-sm font-black text-slate-900">
                {movementItem?.minimum_stock} {movementItem?.unit}
              </span>
            </div>
          </div>

          {moveType === 'out' && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                Link to Job / Vehicle (Optional)
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Select an active job...</option>
                {jobs?.filter(j => j.status !== 'done' && j.status !== 'cancelled').map(job => (
                  <option key={job.id} value={job.id}>
                    {job.job_number} • {job.cars?.plate_number} ({job.cars?.make})
                  </option>
                ))}
              </select>
              <p className="text-[9px] text-slate-400 mt-1.5 font-bold italic">
                Linking usage to a job helps track consumption ratios per vehicle.
              </p>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Quantity ({movementItem?.unit})
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              placeholder="Enter quantity..."
              value={moveQty}
              onChange={(e) => setMoveQty(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Notes (Optional)
            </label>
            <textarea
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all resize-none"
              rows={3}
              placeholder="Reason for movement..."
              value={moveNotes}
              onChange={(e) => setMoveNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleRecordMovement}
            disabled={recordMovement.isPending || !moveQty}
            className={cn(
              "w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              moveType === 'in' 
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200" 
                : "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200",
              (!moveQty || recordMovement.isPending) && "opacity-50 cursor-not-allowed"
            )}
          >
            {recordMovement.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {moveType === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                Confirm Stock {moveType === 'in' ? 'In' : 'Out'}
              </>
            )}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

export default InventoryPage;