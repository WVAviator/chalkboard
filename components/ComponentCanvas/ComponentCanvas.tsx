import React from 'react';
import PaintableCodeEditor from '../PaintableCodeEditor/PaintableCodeEditor';
import PaintableDiv from '../PaintableDiv/PaintableDiv';
import PaintableSVG from '../PaintableSVG/PaintableSVG';
import PaintableText from '../PaintableText/PaintableText';
import styles from './ComponentCanvas.module.css';

/**
 * PaintableComponentData is the base data structure that is used to store the data for each item drawn on the canvas.
 */
export interface PaintableComponentData {
  type: string;
  id: string;
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

  /**
   * The primary color of the selected element.
   */
  color: string;

  setComponents: React.Dispatch<React.SetStateAction<PaintableComponentData[]>>;
  id: string;
}

/**
 * A PaintableComponent is a React component that can be drawn on the canvas.
 */
export type PaintableComponent = React.FC<PaintableComponentProps>;

/**
 * A PaintableComponentMap is a map of PaintableComponent types to their React components. This enables tying string types stored in data to React components.
 */
export type PaintableComponentMap = Record<string, PaintableComponent>;

const defaultPaintableComponentMap: PaintableComponentMap = {
  svg: PaintableSVG,
  div: PaintableDiv,
  code: PaintableCodeEditor,
  text: PaintableText,
  none: () => null,
};

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
    if (event.buttons !== 1) return;

    const randomId = Math.random().toString(36).slice(2, 7);

    setComponents((components) => [
      ...components,
      {
        type: activeComponent,
        props: {
          ...activeComponentProps,
          createEvent: event,
          setComponents: setComponents,
        },
        id: `${activeComponent}-${randomId}`,
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
        if (!paintableComponentMap[component.type]) {
          console.error(
            `ComponentCanvas: No component found for type: ${component.type}. `
          );
          return null;
        }

        return React.createElement(paintableComponentMap[component.type], {
          ...component.props,
          key: component.id,
          data: component.data,
          setData: (newData: any) => {
            const newComponents = [...components];
            newComponents[index].data = newData;
            newComponents[index].props.createEvent = null; // createEvent should only be present when it is first created, and null anytime afterwards.
            setComponents(newComponents);
          },
          canvasRect: canvasRef.current?.getBoundingClientRect(),
          setComponents: setComponents,
          id: component.id,
        });
      })}
    </div>
  );
};

export default ComponentCanvas;
