import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Search, 
  Car as CarIcon, 
  User, 
  Calendar, 
  Palette, 
  Gauge,
  Hash,
  AlertCircle,
  CheckCircle2,
  FileText,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HologramCarCard from '../car/HologramCarCard';
import { cn } from '../../lib/utils';
import { getCarLogoUrl } from '../../lib/car-utils';

const carSchema = z.object({
  plate_number: z.string().min(3, 'Plate number is required').toUpperCase(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  color: z.string().min(1, 'Color is required'),
  customer_id: z.string().uuid('Please select a customer'),
  notes: z.string().optional(),
});

const CarForm = ({ onSubmit, initialData, customers, loading }) => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [makeSearch, setMakeSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(carSchema),
    defaultValues: initialData || {},
    mode: 'onChange',
  });

  const watchedFields = useWatch({ control });


  const sectionImages = {
    owner: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
    vehicle: 'https://cdn-icons-png.flaticon.com/128/1150/1150643.png',
    preview: 'https://cdn-icons-png.flaticon.com/128/3096/3096980.png'
  };


  useEffect(() => {
    const fetchMakes = async () => {
      setIsLoadingMakes(true);
      try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
        const data = await response.json();


        const tanzaniaMakes = ['Toyota', 'Nissan', 'Honda', 'Suzuki', 'Mitsubishi', 'Mazda', 'Ford', 'Subaru', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Isuzu', 'Land Rover'];

        const fetchedMakes = data.Results.map(m => m.MakeName);
        const otherMakes = fetchedMakes.filter(m => !tanzaniaMakes.includes(m)).sort();

        setMakes([...tanzaniaMakes, ...otherMakes]);
      } catch (error) {
        console.error('Error fetching makes:', error);
        setMakes(['Toyota', 'Nissan', 'Honda', 'Suzuki', 'Mitsubishi', 'Mazda', 'Ford', 'Subaru', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Isuzu', 'Land Rover']);
      } finally {
        setIsLoadingMakes(false);
      }
    };
    fetchMakes();
  }, []);


  useEffect(() => {
    const fetchModels = async () => {
      if (!watchedFields.make || watchedFields.make.length < 2) {
        setModels([]);
        return;
      }
      setIsLoadingModels(true);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${watchedFields.make}?format=json`);
        const data = await response.json();
        setModels(data.Results.map(m => m.Model_Name));
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    const timeoutId = setTimeout(fetchModels, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedFields.make]);

  const filteredMakes = makes.filter(m => 
    m.toLowerCase().includes(makeSearch.toLowerCase())
  );

  const filteredModels = models.filter(m => 
    m.toLowerCase().includes(modelSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Customer Selection Section with Image */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <img 
                src={sectionImages.owner} 
                alt="Owner"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Owner Information</h4>
              <p className="text-xs text-gray-500">Select the vehicle owner</p>
            </div>
          </div>
          
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
            <select
              {...register('customer_id')}
              className={cn(
                "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-10 py-3 text-sm font-medium text-gray-900 appearance-none cursor-pointer focus:bg-white focus:outline-none transition-all",
                errors.customer_id 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-gray-200 focus:border-orange-500"
              )}
            >
              <option value="">Select a customer...</option>
              {customers?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} • {c.phone}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            {errors.customer_id && (
              <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.customer_id.message}
              </p>
            )}
          </div>
        </div>

        {/* Vehicle Details Section with Image */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <img 
                src={sectionImages.vehicle} 
                alt="Vehicle"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Vehicle Details</h4>
              <p className="text-xs text-gray-500">Enter vehicle information</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Plate Number */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                Plate Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('plate_number')}
                  className={cn(
                    "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium uppercase tracking-wider placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                    errors.plate_number 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-gray-200 focus:border-orange-500"
                  )}
                  placeholder="T 123 ABC"
                />
                {!errors.plate_number && watchedFields.plate_number?.length >= 3 && (
                  <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.plate_number && (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.plate_number.message}
                </p>
              )}
            </div>

            {/* Make and Model */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Make <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    {...register('make')}
                    value={watch('make') || ''}
                    onChange={(e) => {
                      setValue('make', e.target.value);
                      setMakeSearch(e.target.value);
                      setShowMakeDropdown(true);
                    }}
                    onFocus={() => setShowMakeDropdown(true)}
                    onBlur={() => setTimeout(() => setShowMakeDropdown(false), 200)}
                    autoComplete="off"
                    className={cn(
                      "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                      errors.make ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-orange-500"
                    )}
                    placeholder="Toyota"
                  />
                  {isLoadingMakes && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                  )}
                </div>
                <AnimatePresence>
                  {showMakeDropdown && filteredMakes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredMakes.map(make => (
                        <button
                          key={make}
                          type="button"
                          onClick={() => {
                            setValue('make', make);
                            setShowMakeDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d34932] transition-colors flex items-center gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center p-1 group-hover:bg-white transition-colors">
                            <img
                              src={getCarLogoUrl(make)}
                              alt={make}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center">
                              <CarIcon size={14} className="text-gray-400" />
                            </div>
                          </div>
                          <span className="flex-1">{make}</span>
                          {watch('make') === make && (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.make && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">{errors.make.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Gauge size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('model')}
                    value={watch('model') || ''}
                    onChange={(e) => {
                      setValue('model', e.target.value);
                      setModelSearch(e.target.value);
                      setShowModelDropdown(true);
                    }}
                    onFocus={() => setShowModelDropdown(true)}
                    onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
                    autoComplete="off"
                    className={cn(
                      "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none transition-all",
                      errors.model ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-orange-500"
                    )}
                    placeholder="Land Cruiser"
                  />
                  {isLoadingModels && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                  )}
                </div>
                <AnimatePresence>
                  {showModelDropdown && filteredModels.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredModels.map(model => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => {
                            setValue('model', model);
                            setShowModelDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d34932] transition-colors flex items-center justify-between group"
                        >
                          <span>{model}</span>
                          {watch('model') === model && (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.model && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">{errors.model.message}</p>
                )}
              </div>
            </div>

            {/* Color & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer bg-white hover:border-orange-500 transition-colors"
                    onChange={(e) => setValue('color', e.target.value)}
                    value={watchedFields.color || '#808080'}
                  />
                  <div className="relative flex-1">
                    <Palette size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('color')}
                      className={cn(
                        "w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 focus:bg-white focus:outline-none transition-all",
                        errors.color ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-orange-500"
                      )}
                      placeholder="Grey"
                    />
                  </div>
                </div>
                {errors.color && (
                  <p className="text-xs text-red-600 font-medium mt-1.5">{errors.color.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 ml-1 mb-1.5 block">
                  Notes <span className="text-gray-400 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('notes')}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

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
              Registering Vehicle...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              {initialData ? 'Update Vehicle' : 'Register Vehicle'}
            </>
          )}
        </button>
      </form>

      {/* Live Preview Section with Image */}
      {watchedFields.make && watchedFields.model && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <img 
                src={sectionImages.preview} 
                alt="Preview"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Live Preview</h4>
              <p className="text-xs text-gray-500">Vehicle hologram visualization</p>
            </div>
          </div>
          <HologramCarCard
            make={watchedFields.make || 'Vehicle'}
            model={watchedFields.model || 'Preview'}
            plate={watchedFields.plate_number || 'T 000 AAA'}
            color={watchedFields.color || '#808080'}
          />
        </div>
      )}
    </div>
  );
};

export default CarForm;