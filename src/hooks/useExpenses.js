import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useExpenses = () => {
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createExpense = useMutation({
    mutationFn: async (newExpense) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense recorded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to record expense');
    },
  });

  return {
    expenses,
    isLoading,
    createExpense,
  };
};
