import React from 'react';
import Selecto from 'react-selecto';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useCanvasRefStore } from '../../hooks/useCanvasRefStore';
import { useSelectionStore } from '../../hooks/useSelectionStore';

const SelectionManager = () => {
  const canvasRef = useCanvasRefStore((state) => state.canvasRef);

  const { selectableElements, addSelectedElement, removeSelectedElement } =
    useSelectionStore((state) => ({
      selectableElements: state.selectableElements,
      addSelectedElement: state.addSelectedElement,
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
      selectFromInside={false}
      onSelect={(e) => {
        e.added.forEach((el) => {
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
