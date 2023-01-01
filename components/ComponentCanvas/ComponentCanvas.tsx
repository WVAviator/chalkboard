import React, { useEffect } from 'react';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import useFocusEvents from '../../hooks/useFocusEvents';
import ClipboardComponent from '../ClipboardPaste/ClipboardComponent';
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
  props?: PaintableComponentProps & any;

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
   * The primary color of the selected element.
   */
  color: string;

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
  paste: ClipboardComponent,
  none: () => null,
};

interface ComponentCanvasProps {
  /**
   * The customPaintableComponents are any custom components that can be drawn on the canvas.
   */
  customPaintableComponents?: PaintableComponentMap;
}

const ComponentCanvas: React.FC<ComponentCanvasProps> = ({
  // activeComponent,
  // activeComponentProps = {},
  customPaintableComponents = {},
}) => {
  const paintableComponentMap = {
    ...defaultPaintableComponentMap,
    ...customPaintableComponents,
  };

  const { activeComponent, activeComponentProps } = useActiveComponentStore(
    (state) => ({
      activeComponent: state.activeComponent,
      activeComponentProps: state.activeComponentProps,
    })
  );

  const { components, addComponent, updateComponent } = useChalkboardDataStore(
    (state) => ({
      addComponent: state.addComponent,
      components: state.chalkboardComponents,
      updateComponent: state.updateComponent,
    })
  );

  // console.log('components', components);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const setCanvasRef = useCanvasRefStore((state) => state.setCanvasRef);

  useEffect(() => {
    if (!canvasRef.current) return;
    setCanvasRef(canvasRef);
  }, [canvasRef, setCanvasRef]);

  const { hasFocus } = useFocusEvents(canvasRef);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();

      // When another element has focus, this paste event should not be handled.
      if (hasFocus) return;

      addComponent({
        type: 'paste',
        props: {
          createEvent: null,
          pasteEvent: event,
        },
        id: `paste-${Math.random().toString(36).slice(2, 7)}`,
        data: {
          width: 300,
          height: 300,
          position: [100, 100],
        },
      });
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [addComponent, hasFocus]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!activeComponent) {
      return;
    }
    if (event.buttons !== 1) return;

    const randomId = Math.random().toString(36).slice(2, 7);

    addComponent({
      type: activeComponent,
      props: {
        ...activeComponentProps,
        createEvent: event,
      },
      id: `${activeComponent}-${randomId}`,
      data: [],
    });
  };

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      onPointerDown={handlePointerDown}
    >
      {components.map((component) => {
        if (!paintableComponentMap[component.type]) {
          console.error(
            `ComponentCanvas: No component found for type: ${component.type}. `
          );
          return null;
        }

        return React.createElement(paintableComponentMap[component.type], {
          ...component.props,
          key: component.id,
          id: component.id,
        });
      })}
    </div>
  );
};

export default ComponentCanvas;
