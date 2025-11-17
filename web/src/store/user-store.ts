import { create } from "zustand";
import type { UserRole } from "@/lib/types";

interface UserState {
  role: UserRole | null;
  name: string | null;
  setRole: (role: UserRole) => void;
  setName: (name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: null,
  name: null,
  setRole: (role) => set({ role }),
  setName: (name) => set({ name }),
}));


