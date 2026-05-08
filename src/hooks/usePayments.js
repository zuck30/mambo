import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const usePayments = (jobId) => {
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          jobs (
            job_number,
            cars (plate_number, make, model),
            job_services (
              *,
              services (name)
            )
          ),
          customers (full_name, phone),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !jobId,
  });

  const createPayment = useMutation({
    mutationFn: async (paymentData) => {
      const { data: receiptNumber, error: rpcError } = await supabase
        .rpc('generate_receipt_number');

      if (rpcError) throw rpcError;

      const { data, error } = await supabase
        .from('payments')
        .insert([{
          job_id: paymentData.job_id,
          customer_id: paymentData.customer_id,
          amount_due: paymentData.amount_due,
          amount_paid: paymentData.amount_paid,
          payment_method: paymentData.payment_method,
          payment_status: paymentData.payment_status,
          notes: paymentData.notes || null,
          paid_at: paymentData.paid_at,
          created_by: paymentData.created_by,
          receipt_number: receiptNumber || ('RISITI-' + Date.now()),
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to record payment');
    },
  });

  const reversePayment = useMutation({
    mutationFn: async ({ paymentId, reason }) => {
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError) throw fetchError;
      if (!payment) throw new Error('Payment not found');

      const { error: updateError } = await supabase
        .from('payments')
        .update({
          payment_status: 'refunded',
          notes: payment.notes 
            ? `${payment.notes} | REVERSED: ${reason}`
            : `REVERSED: ${reason}`,
        })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      const { error: customerError } = await supabase.rpc('reverse_customer_stats', {
        p_customer_id: payment.customer_id,
        p_amount: payment.amount_paid
      });

      if (customerError) {
        console.error('Failed to update customer stats:', customerError);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Payment reversed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reverse payment');
    },
  });

  return {
    payments,
    isLoading,
    createPayment,
    reversePayment,
  };
};