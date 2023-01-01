import { render, renderHook } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { useCanvasRefStore } from '../useCanvasRefStore';

describe('useCanvasRefStore', () => {
  it('should initialize canvasRef to null', () => {
    const { result } = renderHook(() => useCanvasRefStore());
    const { canvasRef } = result.current;
    expect(canvasRef).toBe(null);
  });

  it('should set canvasRef to a given value', () => {
    const TestComponent: React.FC = () => {
      const { setCanvasRef } = useCanvasRefStore();
      const ref = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        setCanvasRef(ref);
      }, [ref]);

      return <div data-testid="test" ref={ref} />;
    };

    const { getByTestId } = render(<TestComponent />);
    const element = getByTestId('test');

    const { result } = renderHook(() => useCanvasRefStore());
    const { canvasRef } = result.current;

    expect(canvasRef.current).toBe(element);
  });

  it('should set canvasRect to the bounding client rect of the canvas element', () => {
    const TestComponent: React.FC = () => {
      const { setCanvasRef } = useCanvasRefStore();
      const ref = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        setCanvasRef(ref);
      }, [ref]);

      return <div data-testid="test" ref={ref} />;
    };

    const { getByTestId } = render(<TestComponent />);
    const element = getByTestId('test');

    const { result } = renderHook(() => useCanvasRefStore());
    const { canvasRect } = result.current;

    expect(canvasRect).toEqual(element.getBoundingClientRect());
  });
});
