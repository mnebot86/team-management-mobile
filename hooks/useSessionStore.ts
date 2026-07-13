import { create } from 'zustand';

type User = {
  id: string;
  email: string;
};

type Profile = {
  id: string;
  name?: string;
};

type SessionState = {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (user: User, token: string) => void;
  setProfile: (profile: Profile) => void;
  logout: () => void;
  setHydrated: () => void;

  getUser: () => User | null;
  getProfile: () => Profile | null;
  getToken: () => string | null;
};

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  setProfile: (profile) =>
    set({
      profile,
    }),

  logout: () =>
    set({
      user: null,
      profile: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
    }),

  setHydrated: () => set({ isHydrated: true }),

  getUser: () => get().user,
  getProfile: () => get().profile,
  getToken: () => get().token,
}));
