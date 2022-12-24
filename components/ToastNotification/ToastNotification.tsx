import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';
import { useToastNotificationStore } from '../../hooks/useToastNotificationStore';

interface ToastNotificationProps {
  // toastNotification: ToastNotificationData;
  // setToastNotification: React.Dispatch<
  //   React.SetStateAction<ToastNotificationData>
  // >;
}

const ToastNotification: React.FC<ToastNotificationProps> = (
  {
    // toastNotification,
    // setToastNotification,
  }
) => {
  const { toastNotification, hideToastNotification } =
    useToastNotificationStore((state) => ({
      toastNotification: state.toastNotification,
      hideToastNotification: state.hideToastNotification,
    }));

  const handleToastClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    hideToastNotification();
    // setToastNotification((toastNotification) => ({
    //   ...toastNotification,
    //   open: false,
    // }));
  };

  return (
    <Snackbar
      open={toastNotification.open}
      autoHideDuration={4000}
      onClose={handleToastClose}
    >
      <Alert
        onClose={handleToastClose}
        severity={toastNotification.severity}
        sx={{ width: '100%' }}
      >
        {toastNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
