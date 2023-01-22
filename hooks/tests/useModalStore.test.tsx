/// <reference types="jest" />

import { useModalStore } from '../useModalStore';
import { renderHook, act } from '@testing-library/react';

describe('useModalStore', () => {
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useModalStore());
    expect(result.current.myChalkboardsModalOpen).toBe(false);
  });

  it('should open and close the modal correctly', () => {
    const { result } = renderHook(() => useModalStore());
    expect(result.current.myChalkboardsModalOpen).toBe(false);

    act(() => {
      result.current.openMyChalkboardsModal();
    });
    expect(result.current.myChalkboardsModalOpen).toBe(true);

    act(() => {
      result.current.closeMyChalkboardsModal();
    });
    expect(result.current.myChalkboardsModalOpen).toBe(false);
  });
});
