import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (_email: string, _password: string) => {
    // Phase 1: Real auth implementation
    set({ isAuthenticated: true, user: { id: '1', email: _email, name: 'Patient' } });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
