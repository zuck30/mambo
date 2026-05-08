import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const useStaff = () => {
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      if (error) throw error;
      return data;
    },
  });

  const createStaff = useMutation({
    mutationFn: async (newStaff) => {
      const { role, full_name, nida_number, phone, salary, email, password } = newStaff;
      let authUserId = null;

      {/*For admin or secretary: create auth user with provided email/password*/}
      if (role === 'admin' || role === 'secretary') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { full_name, role, phone },
          },
        });

        if (authError) throw authError;
        authUserId = authData.user.id;
        toast.success(`Account created: ${email} / ${password}`);
      } else {
        {/*Staff: random UUID, no login*/}
        authUserId = crypto.randomUUID();
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: authUserId,
          full_name,
          nida_number,
          phone,
          role,
          salary: salary || null,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleStaffActive = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Profile updated');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const paySalary = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ last_salary_paid_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Salary marked as paid');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteStaff = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    staff,
    isLoading,
    createStaff,
    toggleStaffActive,
    updateProfile,
    paySalary,
    deleteStaff,
  };
};