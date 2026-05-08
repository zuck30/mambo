import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from '../store/notificationStore';
import { toast } from 'react-hot-toast';
import { differenceInDays, addDays, parseISO } from 'date-fns';

export const useNotifications = () => {
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    // Check for upcoming salaries
    const checkSalaries = async () => {
      const { data: staff } = await supabase.from('profiles').select('*');
      if (staff) {
        const notifications = useNotificationStore.getState().notifications;

        staff.forEach(member => {
          if (member.salary) {
            const lastPaid = member.last_salary_paid_at ? parseISO(member.last_salary_paid_at) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const nextPayment = addDays(lastPaid, 30);
            const daysToPayment = differenceInDays(nextPayment, new Date());

            if (daysToPayment <= 7 && daysToPayment >= 0) {
              const msg = `Salary for ${member.full_name} is due in ${daysToPayment} days.`;
              const exists = notifications.some(n => n.message === msg);

              if (!exists) {
                addNotification({
                  title: 'Salary Due Soon',
                  message: msg,
                  type: 'payment',
                  icon: '💸',
                });
              }
            }
          }
        });
      }
    };

    checkSalaries();

    // Listen for new jobs
    const jobsChannel = supabase
      .channel('realtime-jobs-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'jobs' },
        (payload) => {
          const newJob = payload.new;
          addNotification({
            title: 'New Job Created',
            message: `Job #${newJob.job_number} has been registered in the system.`,
            type: 'job',
            icon: '🚀',
          });
          toast.success(`New Job: ${newJob.job_number}`, { icon: '🚀' });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'jobs' },
        (payload) => {
          const oldJob = payload.old;
          const newJob = payload.new;

          if (oldJob.status !== newJob.status) {
            addNotification({
              title: 'Job Status Updated',
              message: `Job #${newJob.job_number} is now ${newJob.status}.`,
              type: 'job',
              icon: '🔄',
            });
          }
        }
      )
      .subscribe();

    // Listen for new payments
    const paymentsChannel = supabase
      .channel('realtime-payments-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          const payment = payload.new;
          addNotification({
            title: 'Payment Received',
            message: `A payment of TZS ${Number(payment.amount).toLocaleString()} was recorded.`,
            type: 'payment',
            icon: '💰',
          });
          toast.success('Payment Received', { icon: '💰' });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(paymentsChannel);
    };
  }, [addNotification]);

  return null;
};
