import { Button, Menu } from '@mui/material';
import React from 'react';
import { Chrome } from 'react-color';
import styles from './ColorPicker.module.css';

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

  const handleChangeComplete = (color) => {
    setColor(color.hex);
  };

  return (
    <div>
      <Button
        id="color-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        color="secondary"
      >
        <div className={styles.sample} style={{ backgroundColor: color }}></div>
      </Button>
      <Menu
        id="color-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'color-button',
        }}
      >
        <Chrome
          color={color}
          onChangeComplete={handleChangeComplete}
          disableAlpha
        />
      </Menu>
    </div>
  );
};

export default ColorPicker;
