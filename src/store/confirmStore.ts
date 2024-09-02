import { create } from 'zustand';

interface ConfirmState {
  open: boolean;
  title: string;
  description?: string;
  handleProceed?: () => void;
  setConfirm: (params: { title: string; description?: string; handleProceed?: () => void }) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  open: false,
  title: '',
  description: '',
  handleProceed: () => {},
  setConfirm: ({ title, description, handleProceed }) => set({ open: true, title, description, handleProceed }),
  closeConfirm: () => set({ open: false }),
}));
