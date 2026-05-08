import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Package, 
  Ruler, 
  Tag, 
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Boxes,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Truck,
  MapPin,
  Database
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const inventoryItemSchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  unit: z.string().min(1, 'Unit is required (e.g., Liters, pieces)'),
  current_stock: z.coerce.number().min(0, 'Current stock cannot be negative'),
  minimum_stock: z.coerce.number().min(0, 'Minimum stock cannot be negative'),
  category: z.string().optional(),
  unit_cost: z.coerce.number().min(0, 'Cost cannot be negative').optional(),
  supplier: z.string().optional(),
  location: z.string().optional(),
});

const InventoryItemForm = ({ onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: initialData || {
      current_stock: 0,
      minimum_stock: 5,
      unit_cost: 0,
    },
    mode: 'onChange',
  });

  const watchedFields = useWatch({ control });

  const sectionImages = {
    basic: 'https://cdn-icons-png.flaticon.com/128/1150/1150643.png',
    stock: 'https://cdn-icons-png.flaticon.com/128/2737/2737448.png',
    additional: 'https://cdn-icons-png.flaticon.com/128/4505/4505754.png'
  };

  const stockStatus = () => {
    const current = Number(watchedFields.current_stock) || 0;
    const min = Number(watchedFields.minimum_stock) || 0;
    
    if (current < min) return { 
      label: 'Critical', 
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: AlertTriangle 
    };
    if (current < min * 2) return { 
      label: 'Low', 
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      icon: TrendingDown 
    };
    return { 
      label: 'Good', 
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: TrendingUp 
    };
  };

  const status = stockStatus();
  const StatusIcon = status.icon;

  const totalValue = (Number(watchedFields.current_stock) || 0) * (Number(watchedFields.unit_cost) || 0);

  const categories = [
    'Chemicals', 'Tools', 'Parts', 'Consumables', 'Equipment', 'Other'
  ];

  const units = [
    'Liters', 'kg', 'pcs', 'boxes', 'bottles', 'cans', 'gallons', 'meters', 'No Unit'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic Information Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <img 
              src={sectionImages.basic} 
              alt="Basic Info"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h4>
            <p className="text-xs text-gray-500">Enter item details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Item Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('name')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.name 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="e.g., Car Shampoo"
              />
              {!errors.name && watchedFields.name?.length >= 2 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.name && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Category
              </label>
              <div className="relative">
                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  {...register('category')}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-8 py-3 text-sm font-medium text-gray-900 appearance-none cursor-pointer focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Unit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Ruler size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('unit')}
                  list="units"
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.unit 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="e.g., Liters"
                />
                <datalist id="units">
                  {units.map(u => <option key={u} value={u} />)}
                </datalist>
                {!errors.unit && watchedFields.unit && (
                  <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.unit && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.unit.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Management Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <img 
              src={sectionImages.stock} 
              alt="Stock"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Stock Management</h4>
            <p className="text-xs text-gray-500">Set stock levels and alerts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className={cn(
            "rounded-xl p-4 border-2",
            status.color
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                  <StatusIcon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Stock Status</p>
                  <p className="text-xl font-bold">{status.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-wider opacity-70">Current Level</p>
                <p className="text-xl font-bold">
                  {watchedFields.current_stock || 0} {watchedFields.unit || 'units'}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  status.label === 'Critical' ? "bg-rose-500" :
                  status.label === 'Low' ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ 
                  width: `${Math.min(100, ((Number(watchedFields.current_stock) || 0) / ((Number(watchedFields.minimum_stock) || 1) * 3)) * 100)}%` 
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Current Stock <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Boxes size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('current_stock')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.current_stock 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="0"
                />
              </div>
              {errors.current_stock && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.current_stock.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Min Stock Alert <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AlertTriangle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  {...register('minimum_stock')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.minimum_stock 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="5"
                />
              </div>
              {errors.minimum_stock && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.minimum_stock.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Unit Cost <span className="text-gray-400 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">TSh</span>
              <input
                type="number"
                step="0.01"
                {...register('unit_cost')}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-16 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <img 
              src={sectionImages.additional} 
              alt="Additional"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Additional Information</h4>
            <p className="text-xs text-gray-500">Optional details</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Supplier
            </label>
            <div className="relative">
              <Truck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('supplier')}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                placeholder="Supplier name"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Location
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('location')}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                placeholder="Storage location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Value Summary */}
      {watchedFields.current_stock > 0 && watchedFields.unit_cost > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
              <img 
                src={sectionImages.stock} 
                alt="Value"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inventory Value</p>
              <p className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('en-TZ', { 
                  style: 'currency', 
                  currency: 'TZS',
                  maximumFractionDigits: 0 
                }).format(totalValue)}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Per Unit</span>
            <span className="text-lg font-bold text-orange-400">
              {new Intl.NumberFormat('en-TZ', { 
                style: 'currency', 
                currency: 'TZS',
                maximumFractionDigits: 0 
              }).format(watchedFields.unit_cost || 0)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isValid}
        className={cn(
          "w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg",
          isValid 
            ? "bg-slate-900 text-white hover:bg-slate-800" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        )}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {initialData ? 'Updating Item...' : 'Creating Item...'}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            {initialData ? 'Update Inventory Item' : 'Save Inventory Item'}
          </>
        )}
      </button>
    </form>
  );
};

export default InventoryItemForm;