import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Tag, 
  Wrench, 
  Clock, 
  DollarSign, 
  FileText,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Package,
  Sparkles,
  Droplets,
  Wind,
  PenTool,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';  // Fixed: added AnimatePresence and proper quotes
import { formatCurrency } from '../../lib/utils';

const serviceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  duration_minutes: z.coerce.number().min(5, 'Minimum 5 minutes'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const ServiceForm = ({ onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      is_active: true,
      category: 'Wash',
      duration_minutes: 30,
    },
    mode: 'onChange',
  });

  const watchedFields = useWatch({ control });

  // Categories with images (like PaymentForm payment methods)
  const categories = [
    { 
      id: 'Wash', 
      label: 'Wash', 
      icon: Droplets, 
      image: 'https://cdn-icons-png.flaticon.com/128/18208/18208167.png',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      activeBorder: 'ring-2 ring-sky-500 border-sky-500'
    },
    { 
      id: 'Detailing', 
      label: 'Detailing', 
      icon: Sparkles, 
      image: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      activeBorder: 'ring-2 ring-purple-500 border-purple-500'
    },
    { 
      id: 'Engine', 
      label: 'Engine', 
      icon: Wrench, 
      image: 'https://cdn-icons-png.flaticon.com/128/2061/2061956.png',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500'
    },
    { 
      id: 'Tire', 
      label: 'Tire', 
      icon: Package, 
      image: 'https://cdn-icons-png.flaticon.com/128/809/809999.png',
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      activeBorder: 'ring-2 ring-slate-500 border-slate-500'
    },
    { 
      id: 'Interior', 
      label: 'Interior', 
      icon: Wind, 
      image: 'https://cdn-icons-png.flaticon.com/128/16868/16868818.png',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    { 
      id: 'Other', 
      label: 'Other', 
      icon: MoreHorizontal, 
      image: 'https://cdn-icons-png.flaticon.com/128/7245/7245102.png',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      activeBorder: 'ring-2 ring-rose-500 border-rose-500'
    },
  ];

  const getCategoryColor = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const CategoryIcon = categories.find(c => c.id === watchedFields.category)?.icon || Wrench;
  const selectedCategory = categories.find(c => c.id === watchedFields.category);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Wrench size={20} className="text-[#d34932]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h4>
            <p className="text-xs text-gray-500">Enter service details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Service Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Wrench size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('name')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.name 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="e.g., Premium Wash"
              />
              {!errors.name && watchedFields.name?.length >= 3 && (
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

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Description <span className="text-gray-400 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                {...register('description')}
                rows={3}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all resize-none"
                placeholder="What's included in this service?"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection - Like PaymentForm methods grid with images */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Service Category</h4>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const isActive = watchedFields.category === category.id;
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue('category', category.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200",
                  isActive
                    ? `${category.activeBorder} shadow-lg bg-white`
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={category.image} 
                      alt={category.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cpath d=\'M12 8v8M8 12h8\'%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={isActive ? "text-gray-900" : "text-gray-500"} />
                    <p className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-gray-900" : "text-gray-700"
                    )}>
                      {category.label}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {errors.category && (
          <p className="text-xs text-red-600 font-medium mt-3 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Pricing & Duration */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <DollarSign size={20} className="text-[#d34932]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pricing & Duration</h4>
            <p className="text-xs text-gray-500">Set price and time</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Price */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">TSh</span>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-16 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.price 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="0.00"
              />
              {!errors.price && watchedFields.price > 0 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.price && (
              <p className="text-xs text-red-600 font-medium mt-1.5">{errors.price.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Duration (min) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                {...register('duration_minutes')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.duration_minutes 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="30"
              />
              {!errors.duration_minutes && watchedFields.duration_minutes >= 5 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.duration_minutes && (
              <p className="text-xs text-red-600 font-medium mt-1.5">{errors.duration_minutes.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Status */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setValue('is_active', !watchedFields.is_active)}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              watchedFields.is_active 
                ? "bg-emerald-50 text-emerald-600" 
                : "bg-gray-100 text-gray-400"
            )}>
              {watchedFields.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Service Status</h4>
              <p className="text-xs text-gray-500">
                {watchedFields.is_active ? 'Service is active and available' : 'Service is inactive'}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            {...register('is_active')}
            className="hidden"
          />
        </div>
      </div>

      {/* Service Preview */}
      {watchedFields.name && watchedFields.price > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              selectedCategory?.color?.split(' ')[0] || "bg-gray-700"
            )}>
              <img 
                src={selectedCategory?.image} 
                alt={selectedCategory?.label}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold">{watchedFields.name}</p>
              <p className="text-xs text-slate-400">{watchedFields.category}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <DollarSign size={14} className="text-orange-400" />
                <span className="text-base font-bold">{formatCurrency(watchedFields.price)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-300">{watchedFields.duration_minutes} min</span>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              watchedFields.is_active 
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
            )}>
              {watchedFields.is_active ? 'Active' : 'Inactive'}
            </div>
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
            {initialData ? 'Updating Service...' : 'Creating Service...'}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            {initialData ? 'Update Service' : 'Save Service'}
          </>
        )}
      </button>
    </form>
  );
};

export default ServiceForm;