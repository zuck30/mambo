import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useRealtime = (table, queryKey) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          {/*Invalidate and refetch the query*/}
          queryClient.invalidateQueries({ queryKey });

          if (payload.eventType === 'INSERT') {
            toast('New entry in queue!', { icon: '🚀' });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKey, queryClient]);
};
