import getStroke from 'perfect-freehand';
import React, { useEffect, useImperativeHandle } from 'react';
import useDragTransform from '../../hooks/useDragTransform';
import { PaintableComponentProps } from '../ComponentCanvas/ComponentCanvas';
import { getSvgPathFromStroke } from './utils';
import styles from './PaintableSVG.module.css';
import withRightClickMenu from '../../hocs/withRightClickMenu';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useSelectionStore } from '../../hooks/useSelectionStore';
import withSelectable from '../../hocs/withSelectable';

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

interface PaintableSVGProps extends PaintableComponentProps {}

const PaintableSVG = React.forwardRef<SVGPathElement, PaintableSVGProps>(
  ({ createEvent, color = '#FFFFFF', id }, ref) => {
    const { data, setData } = useChalkboardDataStore((state) => ({
      data: state.getComponent(id).data,
      setData: (data: any) => state.updateComponent(id, { data }),
    }));
    const canvasRect = useCanvasRefStore((state) => state.canvasRect);
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

    const pathRef = React.useRef<SVGPathElement>(null);
    useImperativeHandle(ref, () => pathRef.current);

    useEffect(() => {
      if (!pathRef.current) return;

      const bBox = pathRef.current.getBBox();
      pathRef.current.style.transformOrigin = `${bBox.x + bBox.width / 2}px ${
        bBox.y + bBox.height / 2
      }px`;
    }, [points]);

    // const { transform, isDragging, dragEvents } = useDragTransform(
    //   createEvent ? { x: 0, y: 0 } : data.transform,
    //   (transform) => setData({ ...data, transform })
    // );

    const { activeComponent } = useActiveComponentStore((state) => ({
      activeComponent: state.activeComponent,
    }));

    const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
      // dragEvents.handlePointerMove(event);

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
      // dragEvents.handlePointerUp(event);

      if (!isDrawing) return;
      setIsDrawing(false);
      setData({ points });
    };

    const stroke = getStroke(points, defaultOptions);
    const pathData = getSvgPathFromStroke(stroke);

    return (
      <svg
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={styles.svg}
        style={{
          pointerEvents: isDrawing ? 'all' : 'none',
          fill: color,
        }}
      >
        {points && (
          <path
            id={id}
            ref={pathRef}
            style={{
              pointerEvents: activeComponent ? 'none' : 'all',
              // transform: `translateX(${data.transform?.x ?? 0}px) translateY(${
              //   data.transform?.y ?? 0
              // }px)`,
              transform: data.transform,
            }}
            d={pathData}
          ></path>
        )}
      </svg>
    );
  }
);

export default withRightClickMenu(withSelectable(PaintableSVG));
