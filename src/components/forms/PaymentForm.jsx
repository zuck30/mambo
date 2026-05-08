import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  DollarSign,
  User,
  Car as CarIcon,
  FileText,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const paymentSchema = z.object({
  payment_method: z.enum(['cash', 'mobile', 'card', 'bank_transfer']),
  amount_paid: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  notes: z.string().optional(),
});

const PaymentForm = ({ job, onSubmit, loading }) => {
  const totalDue = job?.job_services?.reduce((sum, s) => sum + Number(s.subtotal), 0) || 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount_paid: totalDue,
      payment_method: 'cash',
      notes: '',
    },
  });

  const paymentMethod = watch('payment_method');
  const amountPaid = watch('amount_paid') || 0;
  const balance = totalDue - amountPaid;
  const isFullyPaid = amountPaid >= totalDue;
  const isOverpayment = amountPaid > totalDue;

  const methods = [
    { 
      id: 'cash', 
      label: 'Cash',
      image: 'https://www.svgrepo.com/show/308983/cash-payment-pay-money-cash.svg',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500'
    },
    { 
      id: 'mobile', 
      label: 'Mobile Money',
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/mobile-money-illustration-svg-download-png-11904594.png',
      activeBorder: 'ring-2 ring-blue-500 border-blue-500'
    },
    { 
      id: 'card', 
      label: 'Credit Card',
      image: 'https://toppng.com/uploads/preview/visa-logo-png-file-11661940001djejnzboj4.png',
      activeBorder: 'ring-2 ring-purple-500 border-purple-500'
    },
    { 
      id: 'bank_transfer', 
      label: 'Bank Transfer',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSerlz14qTBT_NggyUutBc_9ERfH3hLWQKQYQ&s',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500'
    },
  ];

  const quickAmounts = [
    { label: 'Full', value: totalDue },
    { label: '50%', value: totalDue / 2 },
    { label: '25%', value: totalDue / 4 },
  ];

  const handleFormSubmit = (data) => {
    if (amountPaid > 0) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Transaction</p>
            <h3 className="text-2xl font-bold tracking-tight">{job?.job_number}</h3>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <User size={14} className="text-slate-400" />
              <p className="text-sm font-medium text-white">{job?.customers?.full_name}</p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <CarIcon size={14} className="text-slate-400" />
              <p className="text-sm font-medium text-slate-300">{job?.cars?.plate_number}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-slate-400">Total Due</span>
            <span className="text-3xl font-bold text-white">{formatCurrency(totalDue)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h4>

        <div className="grid grid-cols-2 gap-3">
          {methods.map((method) => {
            const isActive = paymentMethod === method.id;
            
            return (
              <motion.button
                key={method.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setValue('payment_method', method.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200",
                  isActive
                    ? `${method.activeBorder} shadow-lg bg-white`
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={method.image} 
                      alt={method.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Crect x=\'2\' y=\'6\' width=\'20\' height=\'12\' rx=\'2\'%3E%3C/rect%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'2\'%3E%3C/circle%3E%3C/svg%3E';
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

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Payment Amount</h4>

        <div className="space-y-4">
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt.label}
                type="button"
                onClick={() => setValue('amount_paid', amt.value)}
                className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
              >
                {amt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">TSh</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register('amount_paid')}
              className={cn(
                "w-full bg-gray-50 border-2 rounded-xl pl-20 pr-4 py-4 text-2xl font-bold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                errors.amount_paid 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-gray-200 focus:border-blue-500"
              )}
              autoFocus
            />
          </div>
          {errors.amount_paid && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.amount_paid.message}
            </p>
          )}

          <AnimatePresence>
            {amountPaid > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-xl border-2",
                  isFullyPaid && !isOverpayment
                    ? "bg-emerald-50 border-emerald-200" 
                    : isOverpayment
                    ? "bg-blue-50 border-blue-200"
                    : "bg-amber-50 border-amber-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isFullyPaid && !isOverpayment ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : isOverpayment ? (
                      <DollarSign size={18} className="text-blue-600" />
                    ) : (
                      <AlertCircle size={18} className="text-amber-600" />
                    )}
                    <span className={cn(
                      "text-sm font-semibold",
                      isFullyPaid && !isOverpayment
                        ? "text-emerald-700"
                        : isOverpayment
                        ? "text-blue-700"
                        : "text-amber-700"
                    )}>
                      {isOverpayment 
                        ? 'Overpayment' 
                        : isFullyPaid 
                        ? 'Full Payment' 
                        : 'Partial Payment'}
                    </span>
                  </div>
                  <span className={cn(
                    "text-base font-bold",
                    isOverpayment ? "text-blue-700" : "text-amber-700"
                  )}>
                    {isOverpayment 
                      ? `Change: ${formatCurrency(Math.abs(balance))}`
                      : balance > 0 
                      ? `Balance: ${formatCurrency(balance)}`
                      : 'Paid in Full'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Notes</h4>

        <textarea
          {...register('notes')}
          rows={2}
          className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:outline-none transition-all resize-none"
          placeholder="Add reference number or additional notes (optional)..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || isSubmitting || amountPaid <= 0}
        className={cn(
          "w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2",
          amountPaid > 0
            ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        )}
      >
        {loading || isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            {isOverpayment 
              ? `Process with ${formatCurrency(Math.abs(balance))} Change`
              : isFullyPaid 
              ? 'Complete Payment' 
              : `Process ${formatCurrency(amountPaid)} Payment`}
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;