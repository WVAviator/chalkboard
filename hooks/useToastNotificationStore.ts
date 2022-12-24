import { AlertColor } from '@mui/material';
import create from 'zustand';

export interface ToastNotificationData {
  open: boolean;
  severity: AlertColor;
  message: string;
}

export interface ToastNotificationStore {
  toastNotification: ToastNotificationData;
  showToastNotification: (message: string, severity: AlertColor) => void;
  hideToastNotification: () => void;
}

export const useToastNotificationStore = create<ToastNotificationStore>(
  (set) => ({
    toastNotification: {
      open: false,
      severity: 'success',
      message: '',
    },
    showToastNotification: (
      message: string,
      severity: AlertColor = 'success'
    ) =>
      set((state) => ({
        toastNotification: {
          open: true,
          severity,
          message,
        },
      })),
    hideToastNotification: () =>
      set((state) => ({
        toastNotification: {
          ...state.toastNotification,
          open: false,
        },
      })),
  })
);
