import React from 'react';
import withRightClickMenu from '../../hocs/withRightClickMenu';
import withSelectable from '../../hocs/withSelectable';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import {
  PaintableComponentData,
  PaintableComponentProps,
} from '../ComponentCanvas/ComponentCanvas';
import styles from './PaintableDiv.module.css';

export interface PaintableDivData extends PaintableComponentData {
  position: number[][];
}
export interface PaintableDivProps extends PaintableComponentProps {
  minWidth?: number;
  minHeight?: number;
  onCreated?: () => void;
  shadow?: 'none' | 'default' | 'dragonly';
  children: React.ReactNode;
}

const PaintableDiv = React.forwardRef<HTMLDivElement, PaintableDivProps>(
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

    const [isSizing, setIsSizing] = React.useState(!!createEvent);

    const { activeComponent, resetActiveComponent } = useActiveComponentStore(
      (state) => ({
        activeComponent: state.activeComponent,
        resetActiveComponent: state.resetActiveComponent,
      })
    );

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isSizing) return;
      if (event.buttons !== 1) return;
      const [x, y] = [
        event.clientX - canvasRect.left,
        event.clientY - canvasRect.top,
      ];
      const width = Math.max(x - position[0], minWidth);
      const height = Math.max(y - position[1], minHeight);
      setData({ ...data, width, height });
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
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
          style={{
            left: `${position[0]}px`,
            top: `${position[1]}px`,
            width: `${data.width}px`,
            height: `${data.height}px`,
            pointerEvents: activeComponent ? 'none' : 'all',
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

export default withRightClickMenu<PaintableDivProps>(
  withSelectable<PaintableDivProps>(PaintableDiv)
);
