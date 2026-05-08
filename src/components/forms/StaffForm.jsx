import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  User, 
  CreditCard, 
  Phone, 
  Mail,
  Shield, 
  CheckCircle2,
  AlertCircle,
  Key,
  Info,
  Award,
  Crown,
  UserCog,
  Users as UsersIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// Defines validation rules for staff form data
const staffSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  nida_number: z.string().length(20, 'NIDA number must be 20 digits').regex(/^\d+$/, 'NIDA number must contain only digits'),
  phone: z.string().min(9, 'Valid phone number is required'),
  role: z.enum(['admin', 'secretary', 'staff']),
  salary: z.coerce.number().min(0, 'Salary must be 0 or more').optional(),
  email: z.string().optional(),
  password: z.string().optional(),
}).superRefine((data, ctx) => {
  // Checks if role is admin or secretary to apply email/password validation
  if (data.role === 'admin' || data.role === 'secretary') {
    // Validates email is provided and properly formatted for admin/secretary
    if (!data.email || data.email.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required for secretary and admin",
        path: ["email"],
      });
    } else if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid email required",
        path: ["email"],
      });
    }
    // Validates password is provided and meets length requirement for admin/secretary
    if (!data.password || data.password.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required for secretary and admin",
        path: ["password"],
      });
    } else if (data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"],
      });
    }
  }
  // For staff role, no validation runs on email/password fields
});

const StaffForm = ({ onSubmit, initialData, loading }) => {
  const { isSecretary } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData || {
      role: 'staff',
      nida_number: '',
      salary: 0,
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Watches form fields to dynamically show/hide UI elements
  const watchedFields = useWatch({ control });
  // Determines if salary field should be shown (for staff/secretary, excluding secretary user)
  const showSalaryField = (watchedFields.role === 'staff' || watchedFields.role === 'secretary') && !isSecretary;
  // Determines if email/password fields should be shown (only for admin or secretary)
  const showAuthFields = watchedFields.role === 'admin' || watchedFields.role === 'secretary';

  // Defines available roles with images, visual styles and descriptions
  const roles = [
    { 
      id: 'staff', 
      label: 'Staff', 
      icon: UsersIcon, 
      image: 'https://cdn-icons-png.flaticon.com/128/921/921347.png',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      activeColor: 'bg-sky-500',
      activeBorder: 'ring-2 ring-sky-500 border-sky-500',
      description: 'Jobs are assigned to staff members to perform'
    },
    { 
      id: 'secretary', 
      label: 'Secretary', 
      icon: UserCog, 
      image: 'https://cdn-icons-png.flaticon.com/128/18508/18508467.png',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      activeColor: 'bg-amber-500',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500',
      description: 'Extended access. Can manage staff and view reports'
    },
    { 
      id: 'admin', 
      label: 'Administrator', 
      icon: Crown, 
      image: 'https://cdn-icons-png.flaticon.com/128/4646/4646885.png',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      activeColor: 'bg-rose-500',
      activeBorder: 'ring-2 ring-rose-500 border-rose-500',
      description: 'Full access. Can manage all system settings'
    },
  ];

  // Gets the currently selected role object and its icon
  const selectedRole = roles.find(r => r.id === watchedFields.role);
  const RoleIcon = selectedRole?.icon || UsersIcon;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Personal Information Section */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <User size={20} className="text-[#d34932]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Personal Information</h4>
            <p className="text-xs text-gray-500">Enter staff member details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name Input - Required for all roles */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              Full Name <span className="text-red-500">*</span>
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
                placeholder="John Timothy"
              />
              {/* Shows checkmark when field is valid */}
              {!errors.full_name && watchedFields.full_name?.length >= 3 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {/* Displays validation error message */}
            {errors.full_name && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* NIDA Number Input - Required for all roles */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
              NIDA Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register('nida_number')}
                maxLength={20}
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.nida_number 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-orange-500"
                )}
                placeholder="Enter NIDA number"
              />
              {/* Shows checkmark when 20 digits are entered */}
              {!errors.nida_number && watchedFields.nida_number?.length === 20 && (
                <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.nida_number && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.nida_number.message}
              </p>
            )}
          </div>

          {/* Phone Number Input - Required for all roles */}
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
                placeholder="0712345678"
              />
              {/* Shows checkmark when phone has at least 9 digits */}
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

          {/* Email & Password Fields - Only visible when role is admin or secretary */}
          {showAuthFields && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Email Input - Required only for admin/secretary */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className={cn(
                      "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                      errors.email 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-orange-500"
                    )}
                    placeholder="secretary@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input - Required only for admin/secretary */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('password')}
                    type="password"
                    className={cn(
                      "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                      errors.password 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-orange-500"
                    )}
                    placeholder="Create a strong password"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.password.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Salary Field - Visible for staff and secretary roles */}
          {showSalaryField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Salary (Monthly TZS) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">TSh</span>
                <input
                  type="number"
                  {...register('salary')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-16 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.salary
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="500000"
                />
              </div>
              {errors.salary && (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.salary.message}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Role Selection Section with Images */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Access Level</h4>
        
        <div className="grid grid-cols-1 gap-3">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = watchedFields.role === role.id;
            
            return (
              <motion.button
                key={role.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setValue('role', role.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  isActive
                    ? `${role.activeBorder} shadow-lg bg-white`
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    <img 
                      src={role.image} 
                      alt={role.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cpath d=\'M12 8v8M8 12h8\'%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon size={18} className={isActive ? "text-gray-900" : "text-gray-500"} />
                        <p className={cn(
                          "text-base font-bold",
                          isActive ? "text-gray-900" : "text-gray-700"
                        )}>
                          {role.label}
                        </p>
                      </div>
                      {/* Shows checkmark for selected role */}
                      {isActive && (
                        <CheckCircle2 size={20} className="text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      {role.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Staff Summary Card - Shows preview of entered information */}
      {watchedFields.full_name && watchedFields.nida_number && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center">
              <img 
                src={selectedRole?.image} 
                alt={selectedRole?.label}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">{watchedFields.full_name}</p>
              <p className="text-xs text-slate-400">NIDA: {watchedFields.nida_number}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              <span className="text-xs text-slate-300">{watchedFields.phone || 'No phone'}</span>
            </div>
            <div className="flex items-center gap-2">
              <RoleIcon size={14} className="text-orange-400" />
              <span className="text-xs font-bold text-white">{selectedRole?.label}</span>
            </div>
          </div>
          
          {/* Shows salary if entered and greater than 0 */}
          {watchedFields.salary > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
              <Award size={14} className="text-slate-400" />
              <span className="text-xs text-slate-300">
                Salary: {new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS' }).format(watchedFields.salary)}
              </span>
            </div>
          )}
          
          {/* Shows email if auth fields are visible and email exists */}
          {showAuthFields && watchedFields.email && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
              <Mail size={14} className="text-slate-400" />
              <span className="text-xs text-slate-300">{watchedFields.email}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Info Notice - Provides context about account creation based on role */}
      <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
            <Info size={16} className="text-sky-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-sky-900 mb-1">Account Setup Note</p>
            <p className="text-[10px] text-sky-700 leading-relaxed font-medium">
              {/* Shows different message based on whether auth fields are visible */}
              {showAuthFields 
                ? "Secretary and Admin accounts will be created with email/password. They can login to the dashboard."
                : "Staff accounts are records only. They cannot login to the dashboard."}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button - Enabled when form is valid and not loading */}
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
            {initialData ? 'Updating Account...' : 'Creating Account...'}
          </>
        ) : (
          <>
            <Key size={18} />
            {initialData ? 'Update Staff Account' : 'Create Staff Account'}
          </>
        )}
      </button>
    </form>
  );
};

export default StaffForm;