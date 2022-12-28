import React from 'react';
import { Menu, MenuItem, PopoverPosition } from '@mui/material';
import {
  PaintableComponent,
  PaintableComponentData,
  PaintableComponentProps,
} from '../components/ComponentCanvas/ComponentCanvas';
import { useChalkboardDataStore } from '../hooks/useChalkboardDataStore';
import { useSelectionStore } from '../hooks/useSelectionStore';

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

const withRightClickMenu = <P extends PaintableComponentProps>(
  WrappedComponent: PaintableComponent,
  additionalMenuItems?: ContextMenuItem[]
) => {
  return (props: P) => {
    const [anchorPosition, setAnchorPosition] =
      React.useState<PopoverPosition | null>(null);

    const { moveComponent, removeComponent } = useChalkboardDataStore(
      (state) => ({
        moveComponent: state.moveComponent,
        removeComponent: state.removeComponent,
      })
    );

    const wrappedComponentRef = React.useRef<HTMLElement>(null);

    const { removeSelectedElementById, removeSelectableElement } =
      useSelectionStore((state) => ({
        removeSelectedElementById: state.removeSelectedElementById,
        removeSelectableElement: state.removeSelectableElement,
      }));

    const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      setAnchorPosition({ left: event.clientX, top: event.clientY });
    };

    const handleClose = () => {
      setAnchorPosition(null);
    };

    const handleDelete = () => {
      setAnchorPosition(null);
      removeSelectedElementById(props.id);
      // removeSelectableElement(props.id);

      removeComponent(props.id);
    };

    const handleBringToFront = () => {
      setAnchorPosition(null);
      moveComponent(props.id);
    };

    const handleSendToBack = () => {
      setAnchorPosition(null);
      moveComponent(props.id, 0);
    };

    return (
      <div id="wrapper" onContextMenu={handleRightClick}>
        <WrappedComponent ref={wrappedComponentRef} {...props} />
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition}
          open={Boolean(anchorPosition)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
          <MenuItem onClick={handleBringToFront}>Bring to Front</MenuItem>
          <MenuItem onClick={handleSendToBack}>Send to Back</MenuItem>
          {additionalMenuItems?.map((item) => {
            return <MenuItem onClick={item.onClick}>{item.label}</MenuItem>;
          })}
        </Menu>
      </div>
    );
  };
};

export default withRightClickMenu;
