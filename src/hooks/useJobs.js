import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useJobs = () => {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          cars (*),
          customers (*),
          profiles (id, full_name, avatar_url),
          job_services (*, services (*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createJob = useMutation({
    mutationFn: async ({ jobData, services }) => {
        {/ * 1. Get job number from RPC*/}
      const { data: jobNumber } = await supabase.rpc('generate_job_number');

        {/ * 2. Create the job record*/}
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          job_number: jobNumber || ('KAZI-' + new Date().getTime())
        }])
        .select()
        .single();

      if (jobError) throw jobError;

      {/ * Create the job_services records */}
      const jobServices = services.map(s => ({
        job_id: job.id,
        service_id: s.id,
        unit_price: s.price,
        subtotal: s.price * (s.quantity || 1),
        quantity: s.quantity || 1
      }));

      const { error: servicesError } = await supabase
        .from('job_services')
        .insert(jobServices);

      if (servicesError) throw servicesError;

      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Kazi imewekwa Kwenye Foleni.');
    },
    onError: (error) => {
      toast.error(error.message || 'Imeshindwa Kutengeneza Kazi');
    },
  });

  const updateJobStatus = useMutation({
    mutationFn: async ({ id, status, completed_at, started_at }) => {
      const updates = { status, updated_at: new Date().toISOString() };
      if (completed_at) updates.completed_at = completed_at;
      if (started_at) updates.started_at = started_at;

      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Kazi imefutwa.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });

  return {
    jobs,
    isLoading,
    createJob,
    updateJobStatus,
    deleteJob,
  };
};
