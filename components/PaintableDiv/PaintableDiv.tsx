import React from 'react';
import useDragTransform from '../../hooks/useDragTransform';
import { ActiveComponentContext } from '../ActiveComponentProvider/ActiveComponentProvider';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import styles from './PaintableDiv.module.css';

const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

interface PaintableDivProps extends PaintableComponentProps {
  backgroundColor?: string;
  children?: React.ReactNode;
}

const PaintableDiv: React.FC<PaintableDivProps> = ({
  backgroundColor = 'black',
  children = null,
  createEvent,
  data,
  setData,
  canvasRect,
}) => {
  const [position, setPosition] = React.useState(
    createEvent
      ? [
          createEvent.clientX - canvasRect.left,
          createEvent.clientY - canvasRect.top,
        ]
      : data.position
  );
  const [size, setSize] = React.useState(
    createEvent ? [MIN_WIDTH, MIN_HEIGHT] : data.size
  );
  const [isSizing, setIsSizing] = React.useState(!!createEvent);

  const { transform, isDragging, dragEvents } = useDragTransform(
    createEvent ? { x: 0, y: 0 } : data.transform,
    canvasRect,
    (transform) => setData({ ...data, transform })
  );

  const { activeComponent, setActiveComponent } = React.useContext(
    ActiveComponentContext
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    dragEvents.handlePointerMove(event);

    if (!isSizing) return;
    if (event.buttons !== 1) return;
    const [x, y] = [
      event.clientX - canvasRect.left,
      event.clientY - canvasRect.top,
    ];
    const size = [
      Math.max(x - position[0], MIN_WIDTH),
      Math.max(y - position[1], MIN_HEIGHT),
    ];
    setSize(size);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragEvents.handlePointerUp(event);

    if (!isSizing) return;
    setIsSizing(false);
    setActiveComponent(null);
    setData({
      ...data,
      position,
      size,
      transform,
    });
  };

  return (
    <div
      className={styles.outer}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ pointerEvents: isSizing || isDragging ? 'all' : 'none' }}
    >
      <div
        className={styles.inner}
        // onClick={(e: MouseEvent) => {
        //   if (isSizing) return;
        //   e.stopPropagation();
        // }}
        onPointerDown={(event) => {
          if (activeComponent || isSizing) return;
          dragEvents.handlePointerDown(event);
        }}
        style={{
          left: `${position[0]}px`,
          top: `${position[1]}px`,
          width: `${size[0]}px`,
          height: `${size[1]}px`,
          pointerEvents: activeComponent ? 'none' : 'all',
          transform: `translateX(${transform.x}px) translateY(${transform.y}px)`,
          backgroundColor,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PaintableDiv;
