import { StateCreator } from 'zustand';
import { UserSession } from '../types';

export interface AuthSlice {
  userSession: UserSession | null;
  setUserSession: (session: UserSession | null) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userSession: null,
  setUserSession: (session) => set({ userSession: session }),
  logout: () => set({ userSession: null }),
});
