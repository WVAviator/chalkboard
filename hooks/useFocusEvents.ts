import React from 'react';

/**
 * Listens for whether any elements within the canvas have focus.
 * @param focusRef A ref to the parent element of all elements that should be monitored for focus.
 * @param onFocusIn A callback to run when an element within the canvas receives focus.
 * @param onFocusOut A callback to run when an element within the canvas loses focus.
 * @returns { hasFocus: boolean }
 */
const useFocusEvents = (
  focusRef: React.MutableRefObject<HTMLElement>,
  onFocusIn?: () => void,
  onFocusOut?: () => void
) => {
  const [hasFocus, setHasFocus] = React.useState(false);
  React.useEffect(() => {
    const element = focusRef.current;
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
  }, [focusRef]);

  return { hasFocus };
};

export default useFocusEvents;
