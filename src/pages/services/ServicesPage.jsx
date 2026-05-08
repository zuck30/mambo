import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search as SearchIcon, 
  Wrench, 
  Clock, 
  Tag, 
  Filter,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Package,
  AlertCircle,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  ChevronDown,
  DollarSign,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../../components/layout/PageHeader';
import AppCard from '../../components/ui/AppCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/LoadingSpinner';
import { useServices } from '../../hooks/useServices';
import { formatCurrency } from '../../lib/utils';
import BottomSheet from '../../components/ui/BottomSheet';
import ServiceForm from '../../components/forms/ServiceForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useUIStore } from '../../store/uiStore';
import EmptyState from '../../components/ui/EmptyState';
import { cn } from '../../lib/utils';
import DataTable from '../../components/ui/DataTable';

const ServicesPage = () => {
  const { services, isLoading, createService, updateService, deleteService } = useServices();
  const { modals, openModal, closeModal, selectedItem } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    category: true,
    price: true,
    duration: true,
    status: true,
    description: true,
    actions: true
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const categories = ['all', ...new Set(services?.map(s => s.category) || [])];
  
  const filteredServices = services?.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });


  const totalServices = services?.length || 0;
  const activeServices = services?.filter(s => s.is_active).length || 0;
  const avgPrice = services?.length > 0 
    ? services.reduce((sum, s) => sum + Number(s.price), 0) / services.length 
    : 0;
  const categoriesCount = new Set(services?.map(s => s.category)).size || 0;

  const handleAdd = () => {
    openModal('serviceForm');
  };

  const handleEdit = (service) => {
    openModal('serviceForm', service);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const onFormSubmit = async (data) => {
    if (selectedItem) {
      await updateService.mutateAsync({ id: selectedItem.id, ...data });
    } else {
      await createService.mutateAsync(data);
    }
    closeModal('serviceForm');
  };

  const confirmDelete = async () => {
    await deleteService.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };


  const columns = [
    {
      key: 'name',
      label: 'Service Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932] shrink-0">
            <Wrench size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{row.name}</p>
            {row.description && (
              <p className="text-[9px] font-bold text-slate-400 line-clamp-1 max-w-xs">
                {row.description}
              </p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">
          <Tag size={10} />
          {row.category}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (row) => (
        <p className="font-black text-[#d34932] text-sm">{formatCurrency(row.price)}</p>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={12} className="text-slate-400" />
          <span className="font-bold text-xs">{row.duration_minutes} min</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.is_active ? 'done' : 'cancelled'} />
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">
          {row.description || '—'}
        </p>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-lg transition-all"
            title="Edit Service"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Delete Service"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];


  const visibleColumnsList = columns.filter(col => visibleColumns[col.key]);

  const renderListView = () => {
    return (
      <div className="divide-y divide-slate-100">
        {filteredServices?.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 hover:bg-slate-50 transition-all cursor-pointer"
            onClick={() => handleEdit(service)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#d34932]">
                  <Wrench size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-slate-900">{service.name}</h3>
                    <StatusBadge status={service.is_active ? 'done' : 'cancelled'} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest">
                    <Tag size={8} />
                    {service.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                <p className="text-lg font-black text-[#d34932]">{formatCurrency(service.price)}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">{service.duration_minutes} minutes</p>
                </div>
              </div>
            </div>
            
            {service.description && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 line-clamp-2">
                  {service.description}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };


  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        <AnimatePresence>
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg transition-all group overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {service.category}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-0.5">{service.name}</h3>
                    </div>
                  </div>
                  <StatusBadge status={service.is_active ? 'done' : 'cancelled'} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                    <p className="text-xl font-black text-[#d34932]">{formatCurrency(service.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <div className="flex items-center justify-end gap-1">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-sm font-black text-slate-700">{service.duration_minutes} min</p>
                    </div>
                  </div>
                </div>

                {service.description && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-slate-400 hover:text-[#d34932] hover:bg-orange-50 rounded-lg transition-all"
                  title="Edit Service"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Delete Service"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 p-1 md:p-4 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-lg p-8 md:p-12 text-white relative overflow-hidden mb-1">
          <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
            <Wrench size={300} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
              <RefreshCw size={14} className="animate-spin" /> Loading Services
            </div>
            <p className="text-lg text-slate-400 font-bold">Fetching service menu...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-4" />
              <div className="h-6 bg-slate-100 rounded w-2/3 mb-6" />
              <div className="h-8 bg-slate-100 rounded w-full" />
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
          <Wrench size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#d34932] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-orange-900/20">
                <Wrench size={14} /> Service Management
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 leading-none">
                Service <span className="text-[#d34932]">Menu</span>
              </h2>
              <p className="text-lg text-slate-400 font-bold">
                Configure your service offerings, pricing, and availability.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="bg-[#d34932] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              Add New Service
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
              {totalServices}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-[#d34932] group-hover:scale-110 transition-transform">
            <Package size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Services</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors">
              {activeServices}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Price</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-sky-500 transition-colors">
              {formatCurrency(avgPrice)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-500 group-hover:scale-110 transition-transform">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Categories</p>
            <p className="text-2xl font-black text-slate-900 group-hover:text-purple-500 transition-colors">
              {categoriesCount}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
            <Layers size={20} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Search Services
            </label>
            <div className="relative">
              <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-black text-slate-900 focus:ring-2 focus:ring-[#d34932] focus:outline-none transition-all appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4 flex items-end gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Showing Results
              </p>
              <p className="text-sm font-black text-slate-900">
                {filteredServices?.length || 0} services
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-slate-50 border border-slate-100 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === 'grid' 
                    ? "bg-white text-[#d34932] shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                )}
                title="Grid View"
              >
                <Package size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === 'list' 
                    ? "bg-white text-[#d34932] shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                )}
                title="List View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === 'table' 
                    ? "bg-white text-[#d34932] shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                )}
                title="Table View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Column Visibility Menu (only for table view) */}
            {viewMode === 'table' && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 hover:text-[#d34932] transition-all"
                >
                  <Eye size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Columns</span>
                  <ChevronDown size={12} />
                </button>
                
                {showColumnMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowColumnMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                      {columns.map(col => col.key !== 'actions' && (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key]}
                            onChange={() => toggleColumn(col.key)}
                            className="rounded border-slate-300 text-[#d34932] focus:ring-[#d34932]"
                          />
                          <span className="font-bold">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Display */}
      {filteredServices?.length > 0 ? (
        viewMode === 'grid' ? (
          renderGridView()
        ) : viewMode === 'list' ? (
          renderListView()
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <DataTable 
              columns={visibleColumnsList} 
              data={filteredServices || []}
              onRowClick={(row) => handleEdit(row)}
            />
          </div>
        )
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
            <Wrench size={32} className="text-[#d34932]" />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">No services found</h3>
          <p className="text-sm text-slate-400 font-bold mb-6 max-w-md mx-auto">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search criteria or filters' 
              : 'Start building your service menu to offer to customers'}
          </p>
          {(searchTerm || filterCategory !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              <RefreshCw size={14} /> Clear Filters
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d34932] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              <Plus size={14} /> Add Your First Service
            </button>
          )}
        </div>
      )}

      {/* Service Form Modal */}
      <BottomSheet
        isOpen={modals.serviceForm}
        onClose={() => closeModal('serviceForm')}
        title={selectedItem ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm
          onSubmit={onFormSubmit}
          initialData={selectedItem}
          loading={createService.isPending || updateService.isPending}
        />
      </BottomSheet>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone and may affect existing jobs."
        confirmText="Delete Service"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ServicesPage;