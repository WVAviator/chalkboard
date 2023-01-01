import { useToastNotificationStore } from '../useToastNotificationStore';
import { renderHook, act } from '@testing-library/react';

describe('useToastNotificationStore', () => {
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useToastNotificationStore());
    expect(result.current.toastNotification).toEqual({
      open: false,
      severity: 'success',
      message: '',
    });
  });

  it('should show and hide the toast notification correctly', () => {
    const { result } = renderHook(() => useToastNotificationStore());
    expect(result.current.toastNotification.open).toBe(false);

    act(() => {
      result.current.showToastNotification(
        'This is a success message',
        'success'
      );
    });
    expect(result.current.toastNotification).toEqual({
      open: true,
      severity: 'success',
      message: 'This is a success message',
    });

    act(() => {
      result.current.hideToastNotification();
    });
    expect(result.current.toastNotification.open).toBe(false);
  });

  it('should show the toast notification with the correct severity', () => {
    const { result } = renderHook(() => useToastNotificationStore());
    expect(result.current.toastNotification.open).toBe(false);

    act(() => {
      result.current.showToastNotification('This is an error message', 'error');
    });
    expect(result.current.toastNotification).toEqual({
      open: true,
      severity: 'error',
      message: 'This is an error message',
    });
  });
});
