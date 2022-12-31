import React from 'react';
import { useCanvasRefStore } from './useCanvasRefStore';

/**
 * Listens for whether any elements within the canvas have focus.
 * @param onFocusIn A callback to run when an element within the canvas receives focus.
 * @param onFocusOut A callback to run when an element within the canvas loses focus.
 * @returns { hasFocus: boolean }
 */
const useFocusEvents = (onFocusIn?: () => void, onFocusOut?: () => void) => {
  const canvasRef = useCanvasRefStore((state) => state.canvasRef);
  const [hasFocus, setHasFocus] = React.useState(false);
  React.useEffect(() => {
    const element = canvasRef.current;
    if (!element) {
      return;
    }

    const handleFocusIn = () => {
      onFocusIn && onFocusIn();
      setHasFocus(true);
    };

    const handleFocusOut = () => {
      onFocusOut && onFocusOut();
      setHasFocus(false);
    };

    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);
    return () => {
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
    };
  }, [canvasRef]);

  return { hasFocus };
};

export default useFocusEvents;
