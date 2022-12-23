import React from 'react';
import { Menu, MenuItem, PopoverPosition } from '@mui/material';
import {
  PaintableComponentData,
  PaintableComponentProps,
} from '../components/ComponentCanvas/ComponentCanvas';

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

const withRightClickMenu = <P extends PaintableComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  additionalMenuItems?: ContextMenuItem[]
) => {
  return (props: P) => {
    // const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorPosition, setAnchorPosition] =
      React.useState<PopoverPosition | null>(null);

    // const wrappedComponentRef = React.useRef<React.ComponentType<P>>(null);

    const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();

      setAnchorPosition({ left: event.clientX, top: event.clientY });
    };

    const handleClose = () => {
      setAnchorPosition(null);
    };

    const handleDelete = () => {
      setAnchorPosition(null);

      props.setComponents((components: PaintableComponentData[]) => {
        return components.filter((component) => component.id !== props.id);
      });
    };

    const handleBringToFront = () => {
      setAnchorPosition(null);

      props.setComponents((components: PaintableComponentData[]) => {
        const newComponents = [...components];
        const componentIndex = newComponents.findIndex(
          (component) => component.id === props.id
        );
        const component = newComponents.splice(componentIndex, 1)[0];
        newComponents.push(component);
        return newComponents;
      });
    };

    const handleSendToBack = () => {
      setAnchorPosition(null);

      props.setComponents((components: PaintableComponentData[]) => {
        const newComponents = [...components];
        const componentIndex = newComponents.findIndex(
          (component) => component.id === props.id
        );
        const component = newComponents.splice(componentIndex, 1)[0];
        newComponents.unshift(component);
        return newComponents;
      });
    };

    return (
      <div id="wrapper" onContextMenu={handleRightClick}>
        <WrappedComponent {...props} />
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition}
          open={Boolean(anchorPosition)}
          onClose={handleClose}
          //   ref={wrappedComponentRef}
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
