import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      session: null,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setSession: (session) => set({ session }),
      logout: () => {
        set({ user: null, profile: null, session: null });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
