import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useServices = () => {
  const queryClient = useQueryClient();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createService = useMutation({
    mutationFn: async (newService) => {
      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create service');
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update service');
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete service');
    },
  });

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
  };
};
