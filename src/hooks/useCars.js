import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useCars = (id) => {
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*, customers (full_name, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !id,
  });

  const { data: car, isLoading: isLoadingCar } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*, customers (*), jobs (*, profiles (full_name))')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const createCar = useMutation({
    mutationFn: async (newCar) => {
      const { data, error } = await supabase
        .from('cars')
        .insert([newCar])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add car');
    },
  });

  const updateCar = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
      toast.success('Car updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update car');
    },
  });

  return {
    cars,
    car,
    isLoading: id ? isLoadingCar : isLoading,
    createCar,
    updateCar,
  };
};
