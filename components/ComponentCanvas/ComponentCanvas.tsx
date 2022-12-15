import React from 'react';
import styles from './ComponentCanvas.module.css';

/**
 * PaintableComponentData is the base data structure that is used to store the data for each item drawn on the canvas.
 */
export interface PaintableComponentData {
  type: string;
  props?: any;
  data: any;
}

export interface PaintableComponentProps {
  /**
   * The createEvent is the pointerDown event that created this component. After the first data update received from the component, it will be null.
   */
  createEvent: React.PointerEvent<HTMLDivElement> | null;

  /**
   * The data stored for this component. his could represent a path, a set of points, or any other data that the component needs to store.
   */
  data: any;

  /**
   * The setData function is used to update the data stored for this component. This is used by the component to update the data stored for it.
   */
  setData: (newData: any) => void;

  /**
   * The canvasRect is the DOMRect of the canvas. This is used by the component to calculate the position of the pointer relative to the canvas.
   */
  canvasRect: DOMRect;
}

/**
 * A PaintableComponent is a React component that can be drawn on the canvas.
 */
export type PaintableComponent = React.FC<PaintableComponentProps>;

/**
 * A PaintableComponentMap is a map of PaintableComponent types to their React components. This enables tying string types stored in data to React components.
 */
export type PaintableComponentMap = Record<string, PaintableComponent>;

const defaultPaintableComponentMap: PaintableComponentMap = {};

interface ComponentCanvasProps {
  activeComponent: string | null;
  activeComponentProps?: any;
  setComponents: React.Dispatch<React.SetStateAction<PaintableComponentData[]>>;
  components: PaintableComponentData[];
  customPaintableComponents?: PaintableComponentMap;
}

const ComponentCanvas: React.FC<ComponentCanvasProps> = ({
  activeComponent,
  activeComponentProps = {},
  setComponents,
  components,
  customPaintableComponents = {},
}) => {
  const paintableComponentMap = {
    ...defaultPaintableComponentMap,
    ...customPaintableComponents,
  };

  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!activeComponent) {
      return;
    }

    setComponents((components) => [
      ...components,
      {
        type: activeComponent,
        props: activeComponentProps,
        data: [],
      },
    ]);
  };

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      onPointerDown={handlePointerDown}
    >
      {components.map((component, index) => {
        return React.createElement(paintableComponentMap[component.type], {
          ...component.props,
          key: index,
          data: component.data,
          setData: (newData: any) => {
            const newComponents = [...components];
            newComponents[index].data = newData;
            newComponents[index].props.createEvent = null; // createEvent should only be present when it is first created, and null anytime afterwards.
            setComponents(newComponents);
          },
          canvasRect: canvasRef.current?.getBoundingClientRect(),
        });
      })}
    </div>
  );
};

export default ComponentCanvas;
