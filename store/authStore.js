import { create } from "zustand";
import api from "@/lib/api";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem("vidyaan_access_token", accessToken);
    localStorage.setItem("vidyaan_refresh_token", refreshToken);
    set({ user, loading: false });
    return user;
  },

  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const { user, accessToken, refreshToken } = data.data;
    localStorage.setItem("vidyaan_access_token", accessToken);
    localStorage.setItem("vidyaan_refresh_token", refreshToken);
    set({ user, loading: false });
    return user;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("vidyaan_refresh_token");
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {}
    localStorage.removeItem("vidyaan_access_token");
    localStorage.removeItem("vidyaan_refresh_token");
    set({ user: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;
