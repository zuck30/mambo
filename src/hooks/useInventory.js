import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: movements, isLoading: isLoadingMovements } = useQuery({
    queryKey: ['inventory_movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*, inventory_items(name), profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createItem = useMutation({
    mutationFn: async (newItem) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item added');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add item');
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update item');
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete item');
    }
  });

  const recordMovement = useMutation({
    mutationFn: async ({ item_id, movement_type, quantity, notes, job_id }) => {
      {/*1. Record movement*/}
      const finalNotes = job_id ? `JOB:${job_id}${notes ? ' | ' + notes : ''}` : notes;
      const { data: movement, error: movementError } = await supabase
        .from('inventory_movements')
        .insert([{ item_id, movement_type, quantity, notes: finalNotes }])
        .select()
        .single();

      if (movementError) throw movementError;

      {/*2. Update current_stock*/}
      const { data: item } = await supabase
        .from('inventory_items')
        .select('current_stock')
        .eq('id', item_id)
        .single();

      const newStock = movement_type === 'in'
        ? Number(item.current_stock) + Number(quantity)
        : Number(item.current_stock) - Number(quantity);

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ current_stock: newStock })
        .eq('id', item_id);

      if (updateError) throw updateError;

      return movement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory_movements'] });
      toast.success('Stock movement recorded');
    },
  });

  const consumptionInsights = items?.map(item => {
    const itemMovements = movements?.filter(m => m.item_id === item.id && m.movement_type === 'out') || [];
    const totalUsed = itemMovements.reduce((sum, m) => sum + Number(m.quantity), 0);
    const uniqueJobs = new Set(
      itemMovements
        .filter(m => m.notes?.startsWith('JOB:'))
        .map(m => m.notes.split(' | ')[0].split(':')[1])
    );
    const vehicleCount = uniqueJobs.size;
    const ratio = vehicleCount > 0 ? (totalUsed / vehicleCount).toFixed(2) : 0;

    return {
      ...item,
      totalUsed,
      vehicleCount,
      ratio,
    };
  }) || [];

  return {
    items,
    movements,
    consumptionInsights,
    isLoading,
    isLoadingMovements,
    createItem,
    updateItem,
    deleteItem,
    recordMovement,
  };
};
