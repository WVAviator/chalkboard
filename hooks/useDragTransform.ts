import React from 'react';
import { ActiveComponentContext } from '../components/ActiveComponentProvider/ActiveComponentProvider';

export interface Transform {
  x: number;
  y: number;
}

/**
 * useDragTransform is a custom hook that provides an updated transform object, isDragging boolean, and dragEvents object which can be used to add custom drag functionality to a component.
 * @param initialTransform the transform at the start of the drag
 * @param canvasRect the DOMRect of the canvas element
 * @param saveTransform a callback function that is invoked when the transform is updated
 * @returns
 */
const useDragTransform = (
  initialTransform: Transform,
  canvasRect: DOMRect,
  saveTransform: (transform: Transform) => void
) => {
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = React.useState({
    pointerX: 0,
    pointerY: 0,
    transformX: 0,
    transformY: 0,
  });
  const [transform, setTransform] = React.useState(initialTransform);

  const { setActiveComponent } = React.useContext(ActiveComponentContext);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.buttons !== 1) return;
    setIsDragging(true);
    setDragStartPos({
      pointerX: event.clientX - canvasRect.left,
      pointerY: event.clientY - canvasRect.top,
      transformX: transform.x,
      transformY: transform.y,
    });
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (isDragging) {
      setTransform({
        ...transform,
        x:
          event.clientX -
          canvasRect.left -
          dragStartPos.pointerX +
          dragStartPos.transformX,
        y:
          event.clientY -
          canvasRect.top -
          dragStartPos.pointerY +
          dragStartPos.transformY,
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setActiveComponent(null);
      saveTransform(transform);
    }
  };

  return {
    transform,
    isDragging,
    dragEvents: {
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    },
  };
};

export default useDragTransform;
