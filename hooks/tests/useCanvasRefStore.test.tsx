import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useCanvasRefStore } from '../useCanvasRefStore';

describe('useCanvasRefStore', () => {
  xit('should initialize canvasRef to null', () => {
    const { result } = renderHook(() => useCanvasRefStore());
    const { canvasRef } = result.current;
    expect(canvasRef).toBe(null);
  });

  xit('should set canvasRef to a given value', () => {
    const { result } = renderHook(() => useCanvasRefStore());
    const { canvasRef, setCanvasRef } = result.current;

    const element = document.createElement('div');
    document.body.appendChild(element);
    const ref = { current: element };
    act(() => {
      setCanvasRef(ref);
    });

    // const ref = { current: document.createElement('div') };
    // setCanvasRef(ref);
    expect(canvasRef).toBe(ref);
  });

  xit('should set canvasRect to the bounding client rect of the canvas element', () => {
    const { result } = renderHook(() => useCanvasRefStore());
    const { setCanvasRef, canvasRect } = result.current;

    const element = document.createElement('div');
    document.body.appendChild(element);
    const ref = { current: element };
    act(() => {
      setCanvasRef(ref);
    });

    expect(canvasRect).toBe(ref.current.getBoundingClientRect());
  });
});
