import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Award,
  Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const customerSchema = z.object({
  full_name: z.string().min(3, 'Full name / Plate number must be at least 3 characters'),
  phone: z.string().min(9, 'Valid phone number is required'),
  notes: z.string().optional(),
  preferred_contact: z.string().optional(),
});

const CustomerForm = ({ onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      preferred_contact: 'phone',
    },
    mode: 'onChange',
  });

  const watchedFields = watch();
  const completionPercentage = Object.values(watchedFields).filter(Boolean).length / 5 * 100;


  const sectionImages = {
    basic: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    additional: 'https://cdn-icons-png.flaticon.com/128/943/943579.png',
    insights: 'https://cdn-icons-png.flaticon.com/128/4336/4336422.png'
  };


  const contactImages = {
    phone: 'https://cdn-icons-png.flaticon.com/128/159/159832.png',
    email: 'https://cdn-icons-png.flaticon.com/128/561/561127.png',
    whatsapp: 'https://cdn-icons-png.flaticon.com/128/733/733585.png'
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Profile Completion */}
      {!initialData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <img 
                src={sectionImages.basic} 
                alt="Profile"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Profile Completion</h4>
              <p className="text-xs text-gray-500">Complete your profile</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Completion Status
            </span>
            <span className="text-xs font-black text-[#d34932]">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              className="h-full bg-gradient-to-r from-[#d34932] to-orange-500 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Basic Information Section with Image */}
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
            <p className="text-xs text-gray-500">Enter customer details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name / Plate Number */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Full Name / Plate Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('full_name')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.full_name 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="John Timothy or T 123 ABC"
              />
              {!errors.full_name && watchedFields.full_name?.length >= 3 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.full_name && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('phone')}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.phone 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="+255 123 456 789"
              />
              {!errors.phone && watchedFields.phone?.length >= 9 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information Section with Image */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <img 
              src={sectionImages.additional} 
              alt="Additional Info"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Additional Information</h4>
            <p className="text-xs text-gray-500">Optional details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Preferred Contact Method with Images */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => register('preferred_contact').onChange({ target: { value: 'phone' } })}
                className={cn(
                  "relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                  watchedFields.preferred_contact === 'phone'
                    ? "ring-2 ring-emerald-500 border-emerald-500 bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src={contactImages.phone} 
                    alt="Phone"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "text-sm font-semibold",
                    watchedFields.preferred_contact === 'phone' ? "text-gray-900" : "text-gray-700"
                  )}>
                    Phone Only
                  </p>
                  <p className="text-[10px] text-gray-500">Call or SMS</p>
                </div>
                {watchedFields.preferred_contact === 'phone' && (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                )}
                <input
                  type="radio"
                  {...register('preferred_contact')}
                  value="phone"
                  className="hidden"
                />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => register('preferred_contact').onChange({ target: { value: 'whatsapp' } })}
                className={cn(
                  "relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                  watchedFields.preferred_contact === 'whatsapp'
                    ? "ring-2 ring-green-500 border-green-500 bg-white"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src={contactImages.whatsapp} 
                    alt="WhatsApp"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "text-sm font-semibold",
                    watchedFields.preferred_contact === 'whatsapp' ? "text-gray-900" : "text-gray-700"
                  )}>
                    WhatsApp
                  </p>
                  <p className="text-[10px] text-gray-500">Instant messaging</p>
                </div>
                {watchedFields.preferred_contact === 'whatsapp' && (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                <input
                  type="radio"
                  {...register('preferred_contact')}
                  value="whatsapp"
                  className="hidden"
                />
              </motion.button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Notes <span className="text-gray-400 text-[10px]">(Optional)</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all resize-none"
                placeholder="Preferred services, vehicle details, special requirements..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Insights (for existing customers) */}
      {initialData && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
              <img 
                src={sectionImages.insights} 
                alt="Insights"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Customer Insights</h4>
              <p className="text-xs text-slate-400">Loyalty & history</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Visits</p>
              <p className="text-2xl font-bold text-white">{initialData.total_visits || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-xl font-bold text-orange-400">
                {new Intl.NumberFormat('en-TZ', { 
                  style: 'currency', 
                  currency: 'TZS',
                  maximumFractionDigits: 0 
                }).format(initialData.total_spent || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-sm font-bold text-slate-300 mt-1">
                {initialData.created_at ? new Date(initialData.created_at).toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric'
                }) : '—'}
              </p>
            </div>
          </div>
        </div>
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
            {initialData ? 'Updating Customer...' : 'Creating Customer...'}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            {initialData ? 'Update Customer' : 'Save Customer'}
          </>
        )}
      </button>
    </form>
  );
};

export default CustomerForm;