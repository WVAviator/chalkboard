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
  /**
   * The type of the component. This is used to tie the data to a React component through the paintableComponentMap.
   */
  type: string;

  /**
   * The id of the component. This is used to uniquely identify the component.
   */
  id: string;

  /**
   * The props of the component. This is used to store and pass props to the React component.
   */
  props?: PaintableComponentProps;

  /**
   * The data of the component. This is used to store any data that the component needs to be parsed.
   */
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

  /**
   * The setComponents function is used to update the components stored in the canvas. This is used by the component to remove itself or update its order in the canvas.
   */
  setComponents: React.Dispatch<React.SetStateAction<PaintableComponentData[]>>;

  /**
   * The id of the component. This is used to uniquely identify the component and differentiate it from other components in calls to setComponents.
   */
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
  /**
   * The activeComponent is the type of the component that is currently being drawn on the canvas.
   */
  activeComponent: string | null;
  /**
   * The activeComponentProps are the additional props that are passed to the activeComponent when it is created.
   */
  activeComponentProps?: any;
  /**
   * The setComponents function is used to update the components stored in the canvas.
   */
  setComponents: React.Dispatch<React.SetStateAction<PaintableComponentData[]>>;
  /**
   * The components are the components that are currently drawn on the canvas.
   */
  components: PaintableComponentData[];
  /**
   * The customPaintableComponents are any custom components that can be drawn on the canvas.
   */
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
