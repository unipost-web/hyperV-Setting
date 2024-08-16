// src/store/alertStore.ts
import create from 'zustand';

interface AlertState {
  open: boolean;
  title: string;
  description: string;
  setAlert: (title: string, description: string) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  title: '',
  description: '',
  setAlert: (title, description) => set({ open: true, title, description }),
  closeAlert: () => set({ open: false }),
}));
