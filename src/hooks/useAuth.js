import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';

export const useAuth = () => {
  const { user, profile, session, setUser, setProfile, setSession, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {/* Check active sessions and sets the user*/}
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    {/* Listen for changes on auth state (logged in, signed out and others*/}
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    logout();
  };

  return {
    user,
    profile,
    session,
    loading,
    login,
    signOut,
    fetchProfile,
    isAdmin: profile?.role === 'admin',
    isManager: profile?.role === 'manager' || profile?.role === 'admin',
    isSecretary: profile?.role === 'secretary',
    isAtLeastSecretary: ['admin', 'manager', 'secretary'].includes(profile?.role),
  };
};
