import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: branch, isLoading } = useQuery({
    queryKey: ['branch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async (updates) => {
      let result;
      if (branch?.id) {
        const { data, error } = await supabase
          .from('branches')
          .update(updates)
          .eq('id', branch.id)
          .select()
          .maybeSingle();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('branches')
          .insert([updates])
          .select()
          .maybeSingle();
        if (error) throw error;
        result = data;
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch'] });
      toast.success('Business settings updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update business settings');
    }
  });

  return {
    branch,
    isLoading,
    updateBusiness
  };
};
