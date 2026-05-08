import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  User,
  Car as CarIcon,
  Wrench,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence }from 'framer-motion';

const jobSchema = z.object({
  customer_id: z.string().uuid('Please select a customer'),
  car_id: z.string().uuid('Please select a car'),
  assigned_staff_id: z.string().uuid('Please assign a staff member'),
  notes: z.string().optional(),
  priority: z.string().optional(),
  estimated_completion: z.string().optional(),
});

const JobForm = ({ onSubmit, customers, staff, services, loading }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      priority: 'normal',
    },
  });

  const selectedCustomerId = useWatch({ control, name: 'customer_id' });
  const selectedCarId = useWatch({ control, name: 'car_id' });
  const selectedCustomer = customers?.find(c => c.id === selectedCustomerId);
  const customerCars = selectedCustomer?.cars || [];

  useEffect(() => {
    if (customerSearch.length > 1) {
      setFilteredCustomers(
        customers?.filter(c =>
          c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.phone.includes(customerSearch)
        ) || []
      );
      setShowCustomerDropdown(true);
    } else {
      setFilteredCustomers([]);
      setShowCustomerDropdown(false);
    }
  }, [customerSearch, customers]);

  const toggleService = (service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const total = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  const onInternalSubmit = (data) => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    onSubmit({ jobData: data, services: selectedServices });
  };


  const steps = [
    { 
      id: 1, 
      label: 'Customer', 
      icon: User,
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-500',
      bgGradient: 'from-emerald-50 to-white'
    },
    { 
      id: 2, 
      label: 'Vehicle', 
      icon: CarIcon,
      image: 'https://png.pngtree.com/png-clipart/20220719/original/pngtree-american-muscle-vintage-car-vector-illustration-png-image_8371936.png',
      activeBorder: 'ring-2 ring-blue-500 border-blue-500',
      bgGradient: 'from-blue-50 to-white'
    },
    { 
      id: 3, 
      label: 'Services', 
      icon: Wrench,
      image: 'https://cdn-icons-png.flaticon.com/512/2997/2997926.png',
      activeBorder: 'ring-2 ring-purple-500 border-purple-500',
      bgGradient: 'from-purple-50 to-white'
    },
    { 
      id: 4, 
      label: 'Assignment', 
      icon: Users,
      image: 'https://cdni.iconscout.com/illustration/premium/thumb/accept-task-illustration-svg-download-png-9910074.png',
      activeBorder: 'ring-2 ring-amber-500 border-amber-500',
      bgGradient: 'from-amber-50 to-white'
    },
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-slate-50 text-slate-600 border-slate-200' },
    { id: 'normal', label: 'Normal', color: 'bg-sky-50 text-sky-600 border-sky-200' },
    { id: 'high', label: 'High', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'urgent', label: 'Urgent', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  const canProceedFromStep = () => {
    if (currentStep === 1) return !!selectedCustomerId;
    if (currentStep === 2) return !!selectedCarId;
    if (currentStep === 3) return selectedServices.length > 0;
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-5">
      {/* Step Selection - Like PaymentForm methods grid with images */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        
        <div className="grid grid-cols-2 gap-3">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <motion.button
                key={step.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200",
                  isActive
                    ? `${step.activeBorder} shadow-lg bg-white`
                    : isCompleted
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50"
                )}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={step.image} 
                      alt={step.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'64\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\'%3E%3C/circle%3E%3Cpath d=\'M12 8v8M8 12h8\'%3E%3C/path%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-sm font-semibold",
                      isActive ? "text-gray-900" : isCompleted ? "text-green-700" : "text-gray-700"
                    )}>
                      {step.label}
                    </p>
                    {isCompleted && (
                      <CheckCircle2 size={14} className="text-green-600 mx-auto mt-1" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Select Customer</h4>
            
            <div className="relative">
              <input
                type="text"
                className={cn(
                  "w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                  errors.customer_id 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-gray-200 focus:border-emerald-500"
                )}
                placeholder="Search by name or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                onFocus={() => setShowCustomerDropdown(true)}
              />
              
              <AnimatePresence>
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredCustomers.map(c => (
                      <div
                        key={c.id}
                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setValue('customer_id', c.id);
                          setCustomerSearch(c.full_name);
                          setShowCustomerDropdown(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{c.full_name}</p>
                            <p className="text-xs text-gray-500">{c.phone}</p>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selectedCustomer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <User size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selectedCustomer.full_name}</p>
                      <p className="text-xs text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
              </motion.div>
            )}

            {errors.customer_id && (
              <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.customer_id.message}
              </p>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Select Vehicle</h4>

            {customerCars.length > 0 ? (
              <div className="space-y-2">
                {customerCars.map(car => (
                  <motion.div
                    key={car.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all cursor-pointer",
                      selectedCarId === car.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    )}
                    onClick={() => setValue('car_id', car.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <CarIcon size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{car.plate_number}</p>
                          <p className="text-xs text-gray-500">{car.make} {car.model} • {car.year}</p>
                        </div>
                      </div>
                      {selectedCarId === car.id && (
                        <CheckCircle2 size={20} className="text-blue-600" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-3">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/3208/3208700.png" 
                    alt="No cars"
                    className="w-full h-full object-contain opacity-50"
                  />
                </div>
                <p className="text-sm font-medium text-gray-500">No vehicles registered</p>
                <button className="mt-3 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  + Register New Vehicle
                </button>
              </div>
            )}

            {errors.car_id && (
              <p className="text-xs text-red-600 font-medium mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.car_id.message}
              </p>
            )}
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Select Services</h4>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {services?.filter(s => s.is_active).map(service => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer",
                    selectedServices.find(s => s.id === service.id)
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  )}
                  onClick={() => toggleService(service)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        selectedServices.find(s => s.id === service.id)
                          ? "bg-purple-600 border-purple-600"
                          : "border-gray-300 bg-white"
                      )}>
                        {selectedServices.find(s => s.id === service.id) && (
                          <CheckCircle2 size={14} className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{service.category}</span>
                          {service.duration_minutes && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={10} />
                                {service.duration_minutes} min
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-purple-600">{formatCurrency(service.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedServices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Selected</p>
                    <p className="text-sm font-bold text-gray-900">
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{totalDuration} min total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Total</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(total)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Assignment & Details</h4>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block mb-2">
                  Assigned Staff <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('assigned_staff_id')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:outline-none transition-all cursor-pointer",
                    errors.assigned_staff_id 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-amber-500"
                  )}
                >
                  <option value="">Select a staff member</option>
                  {staff?.filter(s => s.is_active).map(s => (
                    <option key={s.id} value={s.id}>{s.full_name} • {s.role}</option>
                  ))}
                </select>
                {errors.assigned_staff_id && (
                  <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.assigned_staff_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {priorities.map((priority) => (
                    <label
                      key={priority.id}
                      className={cn(
                        "flex items-center justify-center p-2.5 rounded-xl border-2 cursor-pointer transition-all text-xs font-semibold uppercase tracking-wider",
                        watch('priority') === priority.id
                          ? priority.color
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <input
                        type="radio"
                        {...register('priority')}
                        value={priority.id}
                        className="hidden"
                      />
                      {priority.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-white focus:border-amber-500 focus:outline-none transition-all resize-none"
                  placeholder="Special instructions, customer requests..."
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Summary Card */}
      {selectedServices.length > 0 && selectedCustomer && selectedCarId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider">Job Summary</h4>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              {totalDuration} min est.
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Customer</span>
              <span className="font-semibold">{selectedCustomer?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle</span>
              <span className="font-semibold">
                {customerCars.find(c => c.id === selectedCarId)?.plate_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Services</span>
              <span className="font-semibold">{selectedServices.length} selected</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-bold text-amber-400">{formatCurrency(total)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
          >
            Back
          </button>
        )}
        
        {currentStep < 4 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceedFromStep()}
            className={cn(
              "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
              canProceedFromStep()
                ? "bg-slate-800 text-white hover:bg-slate-900 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || selectedServices.length === 0}
            className={cn(
              "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              selectedServices.length > 0
                ? "bg-slate-800 text-white hover:bg-slate-900 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating Job...
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                Create Job
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default JobForm;