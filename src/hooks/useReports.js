import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useReports = (startDate, endDate) => {
  const { data: revenueStats, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['reports-revenue', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, jobs(job_number, status, car_id), customers(full_name)')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;
      return data;
    },
  });

  const { data: serviceStats, isLoading: isLoadingServices } = useQuery({
    queryKey: ['reports-services', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_services')
        .select('*, services(name, category), jobs!inner(created_at, status)')
        .gte('jobs.created_at', startDate)
        .lte('jobs.created_at', endDate);

      if (error) throw error;
      return data;
    },
  });

  const { data: customerStats, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['reports-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*, cars(*)')
        .order('total_spent', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: inventoryStats, isLoading: isLoadingInventory } = useQuery({
    queryKey: ['reports-inventory', startDate, endDate],
    queryFn: async () => {
      const { data: items, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*');

      const { data: movements, error: movementsError } = await supabase
        .from('inventory_movements')
        .select('*, inventory_items(name)')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (itemsError) throw itemsError;
      if (movementsError) throw movementsError;
      return { items, movements };
    },
  });

  const { data: expenseStats, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['reports-expenses', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate);

      if (error) throw error;
      return data;
    },
  });

  const { data: jobStats, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['reports-jobs', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, cars(plate_number, make, model), customers(full_name), profiles(full_name), job_services(*)')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;
      return data;
    },
  });

  return {
    revenueStats,
    serviceStats,
    customerStats,
    inventoryStats,
    expenseStats,
    jobStats,
    isLoading: isLoadingRevenue || isLoadingServices || isLoadingCustomers || isLoadingInventory || isLoadingExpenses || isLoadingJobs,
  };
};
