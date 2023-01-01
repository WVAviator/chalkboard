import { useActiveComponentStore } from '../useActiveComponentStore';
import { renderHook, act } from '@testing-library/react';

describe('useActiveComponentStore', () => {
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useActiveComponentStore());
    expect(result.current.activeComponent).toBe(null);
    expect(result.current.activeComponentProps).toEqual({
      color: '#FFFFFF',
      textSize: 'medium',
    });
  });

  it('should toggle the active component correctly', () => {
    const { result } = renderHook(() => useActiveComponentStore());
    expect(result.current.activeComponent).toBe(null);

    act(() => {
      result.current.toggleActiveComponent('component1');
    });
    expect(result.current.activeComponent).toBe('component1');

    act(() => {
      result.current.toggleActiveComponent('component1');
    });
    expect(result.current.activeComponent).toBe(null);

    act(() => {
      result.current.toggleActiveComponent('component2');
    });
    expect(result.current.activeComponent).toBe('component2');
  });

  it('should update the color and text size correctly', () => {
    const { result } = renderHook(() => useActiveComponentStore());
    expect(result.current.activeComponentProps).toEqual({
      color: '#FFFFFF',
      textSize: 'medium',
    });

    act(() => {
      result.current.updateColor('#000000');
      result.current.updateTextSize('large');
    });
    expect(result.current.activeComponentProps).toEqual({
      color: '#000000',
      textSize: 'large',
    });
  });

  it('should reset the active component correctly', () => {
    const { result } = renderHook(() => useActiveComponentStore());
    act(() => {
      result.current.toggleActiveComponent('component1');
    });
    expect(result.current.activeComponent).toBe('component1');

    act(() => {
      result.current.resetActiveComponent();
    });
    expect(result.current.activeComponent).toBe(null);
  });

  it('should reset the state correctly', () => {
    const { result } = renderHook(() => useActiveComponentStore());
    act(() => {
      result.current.toggleActiveComponent('component1');
      result.current.updateColor('#000000');
      result.current.updateTextSize('large');
    });
    expect(result.current.activeComponent).toBe('component1');
    expect(result.current.activeComponentProps).toEqual({
      color: '#000000',
      textSize: 'large',
    });

    act(() => {
      result.current.reset();
    });
    expect(result.current.activeComponent).toBe(null);
    expect(result.current.activeComponentProps).toEqual({
      color: '#FFFFFF',
      textSize: 'medium',
    });
  });
});
