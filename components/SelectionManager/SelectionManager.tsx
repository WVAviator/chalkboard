import React from 'react';
import Selecto from 'react-selecto';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useSelectionStore } from '../../hooks/useSelectionStore';

const SelectionManager = () => {
  const canvasRef = useCanvasRefStore((state) => state.canvasRef);
  const [shiftKeyHeld, setShiftKeyHeld] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftKeyHeld(true);
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
  }, []);

  const {
    selectableElements,
    addSelectedElement,
    selectedElements,
    removeSelectedElement,
  } = useSelectionStore((state) => ({
    selectableElements: state.selectableElements,
    addSelectedElement: state.addSelectedElement,
    selectedElements: state.selectedElements,
    removeSelectedElement: state.removeSelectedElement,
  }));

  const activeComponent = useActiveComponentStore(
    (state) => state.activeComponent
  );

  if (!canvasRef?.current || activeComponent) {
    return null;
  }

  return (
    <Selecto
      container={canvasRef.current}
      selectableTargets={selectableElements}
      toggleContinueSelect={['shift']}
      // This enables the user to move a group of elements when shift is not held. Without it, the group would be unselected.
      selectByClick={selectedElements.length <= 1 || shiftKeyHeld}
      selectFromInside={false}
      onSelect={(e) => {
        e.added.forEach((el) => {
          console.log(el);
          addSelectedElement(el);
        });
        e.removed.forEach((el) => {
          removeSelectedElement(el);
        });
      }}
    />
  );
};

export default SelectionManager;
