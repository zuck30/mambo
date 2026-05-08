import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Tag, 
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Package,
  Zap,
  Users,
  Wrench,
  Megaphone,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(3, 'Description is required'),
  amount: z.coerce.number().min(0, 'Amount must be 0 or more'),
  expense_date: z.string().min(1, 'Date is required'),
  payment_method: z.string().optional(),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
  staff_id: z.string().uuid().optional().nullable().or(z.literal('')),
});

const ExpenseForm = ({ onSubmit, loading, staff }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expense_date: new Date().toISOString().split('T')[0],
      category: 'Supplies',
      payment_method: 'cash',
    },
    mode: 'onChange',
  });

  const watchedFields = useWatch({ control });
  const [selectedCategory, setSelectedCategory] = useState('Supplies');

  // Categories with images
  const categories = [
    { 
      id: 'Supplies', 
      label: 'Supplies', 
      icon: Package, 
      image: 'https://cdn-icons-png.flaticon.com/128/3106/3106786.png',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      activeBorder: 'ring-2 ring-sky-500 border-sky-500'
    },
    { 
      id: 'Utilities', 
      label: 'Utilities', 
      icon: Zap, 
      image: 'https://cdn-icons-png.flaticon.com/128/3183/3183636.png',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500'
    },
    { 
      id: 'Salary', 
      label: 'Salary', 
      icon: Users, 
      image: 'https://cdn-icons-png.flaticon.com/128/3135/3135706.png',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    { 
      id: 'Maintenance', 
      label: 'Maintenance', 
      icon: Wrench, 
      image: 'https://cdn-icons-png.flaticon.com/128/2942/2942695.png',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      activeBorder: 'ring-2 ring-purple-500 border-purple-500'
    },
    { 
      id: 'Marketing', 
      label: 'Marketing', 
      icon: Megaphone, 
      image: 'https://cdn-icons-png.flaticon.com/128/3163/3163704.png',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      activeBorder: 'ring-2 ring-rose-500 border-rose-500'
    },
    { 
      id: 'Other', 
      label: 'Other', 
      icon: MoreHorizontal, 
      image: 'https://cdn-icons-png.flaticon.com/128/3081/3081559.png',
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      activeBorder: 'ring-2 ring-slate-500 border-slate-500'
    },
  ];

  // Payment Methods with images
  const paymentMethods = [
    { 
      id: 'cash', 
      label: 'Cash',
      image: 'https://cdn-icons-png.flaticon.com/128/3261/3261792.png',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    { 
      id: 'bank', 
      label: 'Bank Transfer',
      image: 'https://cdn-icons-png.flaticon.com/128/2982/2982102.png',
      activeBorder: 'ring-2 ring-blue-500 border-blue-500'
    },
    { 
      id: 'mobile', 
      label: 'Mobile Money',
      image: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png',
      activeBorder: 'ring-2 ring-purple-500 border-purple-500'
    },
    { 
      id: 'card', 
      label: 'Card',
      image: 'https://cdn-icons-png.flaticon.com/128/179/179457.png',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500'
    },
  ];

  const getCategoryColor = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const CategoryIcon = categories.find(c => c.id === watchedFields.category)?.icon || Package;
  const selectedCategoryData = categories.find(c => c.id === watchedFields.category);
  const selectedPaymentMethod = paymentMethods.find(p => p.id === watchedFields.payment_method);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Category Selection with Images */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Expense Category</h4>
        
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
                onClick={() => {
                  setValue('category', category.id);
                  setSelectedCategory(category.id);
                }}
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
                    <Icon size={14} className={isActive ? "text-gray-900" : "text-gray-500"} />
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

      {/* Expense Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <FileText size={20} className="text-[#d34932]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Expense Details</h4>
            <p className="text-xs text-gray-500">Enter expense information</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('description')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.description 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="e.g., Purchased 10L Car Soap"
              />
              {!errors.description && watchedFields.description?.length >= 3 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.description && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">TSh</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-16 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.amount 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="0.00"
                />
                {!errors.amount && watchedFields.amount > 0 && (
                  <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.amount && (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  {...register('expense_date')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:outline-none transition-all",
                    errors.expense_date 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                />
              </div>
              {errors.expense_date && (
                <p className="text-xs text-red-600 font-medium mt-1.5">{errors.expense_date.message}</p>
              )}
            </div>
          </div>

          {/* Payment Method with Images */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const isActive = watchedFields.payment_method === method.id;
                
                return (
                  <motion.button
                    key={method.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setValue('payment_method', method.id)}
                    className={cn(
                      "relative p-3 rounded-xl border-2 transition-all duration-200",
                      isActive
                        ? `${method.activeBorder} shadow-lg bg-white`
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img 
                          src={method.image} 
                          alt={method.label}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Crect x=\'2\' y=\'6\' width=\'20\' height=\'12\' rx=\'2\'%3E%3C/rect%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'2\'%3E%3C/circle%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      <p className={cn(
                        "text-sm font-semibold",
                        isActive ? "text-gray-900" : "text-gray-700"
                      )}>
                        {method.label}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Reference Number */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Reference Number <span className="text-gray-400 text-[10px]">(Optional)</span>
            </label>
            <input
              {...register('reference_number')}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
              placeholder="e.g., Receipt #, Invoice #"
            />
          </div>

          {/* Staff Member (for deductions) */}
          {(watchedFields.category === 'Salary' || watchedFields.category === 'Maintenance' || watchedFields.category === 'Other') && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Assign to Staff (Salary Deduction)
              </label>
              <div className="relative">
                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  {...register('staff_id')}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:border-orange-500 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select staff...</option>
                  {staff?.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Additional Notes <span className="text-gray-400 text-[10px]">(Optional)</span>
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all resize-none"
              placeholder="Any additional details..."
            />
          </div>
        </div>
      </div>

      {/* Expense Summary */}
      {watchedFields.amount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
              <img 
                src={selectedCategoryData?.image} 
                alt={selectedCategoryData?.label}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-300">{selectedCategoryData?.label}</p>
              <p className="text-sm font-bold text-white line-clamp-1">
                {watchedFields.description || 'No description'}
              </p>
            </div>
          </div>
          
          {selectedPaymentMethod && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
              <img 
                src={selectedPaymentMethod.image} 
                alt={selectedPaymentMethod.label}
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs text-slate-400">{selectedPaymentMethod.label}</span>
            </div>
          )}
          
          <div className="pt-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount</span>
            <span className="text-2xl font-bold text-orange-400">
              {new Intl.NumberFormat('en-TZ', { 
                style: 'currency', 
                currency: 'TZS',
                maximumFractionDigits: 0 
              }).format(watchedFields.amount)}
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
            Recording Expense...
          </>
        ) : (
          <>
            <TrendingDown size={18} />
            Record Expense
          </>
        )}
      </button>
    </form>
  );
};

export default ExpenseForm;