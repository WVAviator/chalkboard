import getStroke from 'perfect-freehand';
import React from 'react';
import useDragTransform from '../../hooks/useDragTransform';
import { ActiveComponentContext } from '../ActiveComponentProvider/ActiveComponentProvider';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import { getSvgPathFromStroke } from './utils';
import styles from './PaintableSVG.module.css';

const defaultOptions = {
  size: 5,
  thinning: 0.6,
  smoothing: 0.5,
  streamline: 0.5,
  start: {
    cap: true,
  },
  end: {
    taper: 5,
    cap: true,
  },
};

interface PaintableSVGProps extends PaintableComponentProps {
  color?: string;
}

const PaintableSVG: React.FC<PaintableSVGProps> = ({
  createEvent,
  data,
  setData,
  canvasRect,
  color = 'white',
}) => {
  const [points, setPoints] = React.useState<number[][]>(
    createEvent
      ? [
          [
            createEvent.clientX - canvasRect.left,
            createEvent.clientY - canvasRect.top,
            createEvent.pressure,
          ],
        ]
      : data.points
  );
  const [isDrawing, setIsDrawing] = React.useState<boolean>(!!createEvent);

  const { transform, isDragging, dragEvents } = useDragTransform(
    createEvent ? { x: 0, y: 0 } : data.transform,
    canvasRect,
    (transform) => setData({ ...data, transform })
  );

  const { activeComponent } = React.useContext(ActiveComponentContext);

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    dragEvents.handlePointerMove(event);

    if (!isDrawing) return;
    if (event.buttons !== 1) return;

    setPoints((points) => [
      ...points,
      [
        event.clientX - canvasRect.left,
        event.clientY - canvasRect.top,
        event.pressure,
      ],
    ]);
  };

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    dragEvents.handlePointerUp(event);

    if (!isDrawing) return;
    setIsDrawing(false);
    setData({ points, transform });
  };

  const stroke = getStroke(points, defaultOptions);
  const pathData = getSvgPathFromStroke(stroke);

  return (
    <svg
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={styles.svg}
      style={{
        pointerEvents: isDrawing || isDragging ? 'all' : 'none',
        fill: color,
      }}
    >
      {points && (
        <path
          onPointerDown={(event) => {
            if (activeComponent || isDrawing) return;
            dragEvents.handlePointerDown(event);
          }}
          style={{
            pointerEvents: activeComponent ? 'none' : 'all',
            transform: `translateX(${transform.x}px) translateY(${transform.y}px)`,
          }}
          d={pathData}
        ></path>
      )}
    </svg>
  );
};

export default PaintableSVG;
