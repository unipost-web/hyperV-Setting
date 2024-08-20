import create from 'zustand';

interface AlertState {
  open: boolean;
  title: string;
  description?: string;
  handleProceed?: () => void;
  setAlert: (params: { title: string; description?: string; handleProceed?: () => void }) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  title: '',
  description: '',
  handleProceed: () => {},
  setAlert: ({ title, description, handleProceed }) => set({ open: true, title, description, handleProceed }),
  closeAlert: () => set({ open: false }),
}));
