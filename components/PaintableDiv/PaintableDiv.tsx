import React, { PropsWithChildren } from 'react';
import withRightClickMenu from '../../hocs/withRightClickMenu';
import withSelectable from '../../hocs/withSelectable';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import useDragTransform, { Transform } from '../../hooks/useDragTransform';
import {
  PaintableComponentData,
  PaintableComponentProps,
} from '../ComponentCanvas/ComponentCanvas';
import styles from './PaintableDiv.module.css';

export interface PaintableDivData extends PaintableComponentData {
  position: number[][];
  size: number[][];
  transform: Transform;
}
interface PaintableDivProps extends PaintableComponentProps {
  minWidth?: number;
  minHeight?: number;
  onCreated?: () => void;
  shadow?: 'none' | 'default' | 'dragonly';
}

const PaintableDiv = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<PaintableDivProps>
>(
  (
    {
      color = '#FFFFFF',
      children,
      createEvent,
      minWidth = 0,
      minHeight = 0,
      onCreated,
      shadow = 'default',
      id,
    },
    forwardedRef
  ) => {
    const { data, setData } = useChalkboardDataStore((state) => ({
      data: state.getComponent(id).data,
      setData: (data: any) => state.updateComponent(id, { data }),
    }));
    const canvasRect = useCanvasRefStore((state) => state.canvasRect);

    const [position, setPosition] = React.useState(
      createEvent
        ? [
            createEvent.clientX - canvasRect.left,
            createEvent.clientY - canvasRect.top,
          ]
        : data.position
    );
    // const [size, setSize] = React.useState(
    //   createEvent ? [minWidth, minHeight] : data.size
    // );
    const [isSizing, setIsSizing] = React.useState(!!createEvent);

    // const { transform, isDragging, dragEvents } = useDragTransform(
    //   createEvent ? { x: 0, y: 0 } : data.transform,
    //   // canvasRect,
    //   (transform) => setData({ ...data, transform })
    // );

    const { activeComponent, resetActiveComponent } = useActiveComponentStore(
      (state) => ({
        activeComponent: state.activeComponent,
        resetActiveComponent: state.resetActiveComponent,
      })
    );

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      // dragEvents.handlePointerMove(event);

      if (!isSizing) return;
      if (event.buttons !== 1) return;
      const [x, y] = [
        event.clientX - canvasRect.left,
        event.clientY - canvasRect.top,
      ];
      // const size = [
      //   Math.max(x - position[0], minWidth),
      //   Math.max(y - position[1], minHeight),
      // ];
      const width = Math.max(x - position[0], minWidth);
      const height = Math.max(y - position[1], minHeight);
      setData({ ...data, width, height });
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      // dragEvents.handlePointerUp(event);

      if (!isSizing) return;
      setIsSizing(false);
      resetActiveComponent();
      setData({
        ...data,
        position,
        // transform,
      });
      onCreated && onCreated();
    };

    const boxShadow = React.useMemo(() => {
      return {
        default:
          'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
        none: 'none',
        dragonly: isSizing
          ? 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
          : 'none',
      };
    }, [isSizing]);

    return (
      <div
        className={styles.outer}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ pointerEvents: isSizing ? 'all' : 'none' }}
      >
        <div
          id={id}
          className={styles.inner}
          ref={forwardedRef}
          // onPointerDown={(event) => {
          //   if (activeComponent || isSizing) return;
          //   dragEvents.handlePointerDown(event);
          // }}
          style={{
            left: `${position[0]}px`,
            top: `${position[1]}px`,
            width: `${data.width}px`,
            height: `${data.height}px`,
            pointerEvents: activeComponent ? 'none' : 'all',
            // transform: `translateX(${data.transform?.x ?? 0}px) translateY(${
            //   data.transform?.y ?? 0
            // }px)`,
            transform: data.transform,
            backgroundColor: color,
            boxShadow: boxShadow[shadow],
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

export default withRightClickMenu(withSelectable(PaintableDiv));
