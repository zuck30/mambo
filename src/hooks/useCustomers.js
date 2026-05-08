import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useCustomers = (id) => {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*, cars (*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !id,
  });

  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          cars (*),
          jobs (*, job_services (*, services (*)), profiles (full_name))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const createCustomer = useMutation({
    mutationFn: async (newCustomer) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([newCustomer])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Imefanikiwa Kuongeza Mteja.');
    },
    onError: (error) => {
      toast.error(error.message || 'Imeshindwa Kuongeza Mteja.');
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update customer');
    },
  });

  return {
    customers,
    customer,
    isLoading: id ? isLoadingCustomer : isLoading,
    createCustomer,
    updateCustomer,
  };
};
