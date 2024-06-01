import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStorage {
  user?: User;
  setUser: (user: User) => void;
  removeUser: () => void;
}

export const useUser = create<UserStorage>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) => {
        set({ user: user });
      },
      removeUser: () => {
        set({ user: undefined });
      },
    }),
    {
      name: 'user',
    },
  ),
);
