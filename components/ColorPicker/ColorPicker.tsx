import { Button, IconButton, Menu } from '@mui/material';
import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import styles from './ColorPicker.module.css';
import ColorLensIcon from '@mui/icons-material/ColorLens';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeComplete = (color: ColorResult) => {
    setColor(color.hex);
  };

  return (
    <div>
      <IconButton
        id="color-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        size="large"
      >
        <ColorLensIcon style={{ color: color }} />
      </IconButton>
      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'color-button',
        }}
      >
        <ChromePicker
          color={color}
          onChangeComplete={handleChangeComplete}
          disableAlpha
        />
      </Menu>
    </div>
  );
};

export default ColorPicker;
