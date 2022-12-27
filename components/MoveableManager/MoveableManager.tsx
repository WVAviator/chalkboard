import React from 'react';
import Moveable from 'react-moveable';
import MoveableGroup from 'react-moveable/declaration/MoveableGroup';
import MoveableIndividualGroup from 'react-moveable/declaration/MoveableIndividualGroup';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { useSelectionStore } from '../../hooks/useSelectionStore';

const MoveableManager = () => {
  const { selectedElements, setSelectionEnabled } = useSelectionStore(
    (state) => ({
      selectedElements: state.selectedElements,
      setSelectionEnabled: state.setSelectionEnabled,
    })
  );

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

  const updateComponentData = useChalkboardDataStore(
    (state) => state.updateComponentData
  );

  if (!selectedElements.length) return null;
  //   console.log('selectedElements: ', selectedElements);

  return (
    <Moveable
      target={selectedElements[0]}
      origin={false}
      draggable={true}
      onDrag={({ target, transform }) => {
        updateComponentData(target.id, { transform });
      }}
      scalable={selectedElements[0].id.startsWith('svg')}
      onScale={({ target, transform }) => {
        if (!target.id.startsWith('svg')) {
          return;
        }
        updateComponentData(target.id, { transform });
      }}
      resizable={!selectedElements[0].id.startsWith('svg')}
      onResize={({ target, width, height }) => {
        if (target.id.startsWith('svg')) {
          return;
        }
        updateComponentData(target.id, { width, height });
      }}
      keepRatio={shiftKeyHeld}
    />
  );
};

export default MoveableManager;
