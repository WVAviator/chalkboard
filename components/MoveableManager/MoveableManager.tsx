import React from 'react';
import Moveable from 'react-moveable';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { useSelectionStore } from '../../hooks/useSelectionStore';

const MoveableManager = () => {
  const { selectedElements, removeSelectedElement, removeSelectableElement } =
    useSelectionStore((state) => ({
      selectedElements: state.selectedElements,
      removeSelectedElement: state.removeSelectedElementById,
      removeSelectableElement: state.removeSelectableElement,
    }));

  const removeComponent = useChalkboardDataStore(
    (state) => state.removeComponent
  );

  const [shiftKeyHeld, setShiftKeyHeld] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyHeld(true);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedElements.forEach((el) => {
          removeSelectedElement(el.id);
          // removeSelectableElement(el.id);
          removeComponent(el.id);
        });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyHeld(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [removeComponent, removeSelectedElement, selectedElements]);

  const updateComponentData = useChalkboardDataStore(
    (state) => state.updateComponentData
  );

  if (!selectedElements.length) return null;

  return (
    <Moveable
      targets={selectedElements}
      origin={false}
      draggable={true}
      onDrag={({ target, transform }) => {
        target.style.transform = transform;
        updateComponentData(target.id, { transform });
      }}
      onDragGroup={({ events }) => {
        events.forEach(({ target, transform }) => {
          target.style.transform = transform;
          updateComponentData(target.id, { transform });
        });
      }}
      // SVG path elements should be scaled versus resized
      scalable={
        selectedElements.length === 1 &&
        selectedElements[0].id.startsWith('svg')
      }
      onScale={({ target, transform }) => {
        if (!target.id.startsWith('svg')) {
          return;
        }
        updateComponentData(target.id, { transform });
      }}
      resizable={
        selectedElements.length === 1 &&
        !selectedElements[0].id.startsWith('svg')
      }
      onResize={({ target, width, height }) => {
        if (target.id.startsWith('svg')) {
          return;
        }
        // This immediately sets width and height, and also updates the state. The redundancy is necessary because the state update is slower and causes a noticeable lag, but is still needed to save the data.
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        updateComponentData(target.id, { width, height });
      }}
      rotatable={selectedElements.length === 1}
      onRotate={({ target, transform }) => {
        updateComponentData(target.id, { transform });
      }}
      keepRatio={shiftKeyHeld}
    />
  );
};

export default MoveableManager;
