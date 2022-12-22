import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

export type TextSize = 'small' | 'medium' | 'large';

interface TextSizePickerProps {
  size: TextSize;
  setSize: (size: TextSize) => void;
}

const TextSizePicker: React.FC<TextSizePickerProps> = ({ size, setSize }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (newSize: TextSize) => {
    setSize(newSize);
    handleClose();
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
        <FormatSizeIcon style={{ color: 'white' }} />
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
        {['small', 'medium', 'large'].map((textSize) => {
          return (
            <MenuItem
              onClick={() => handleChange(textSize as TextSize)}
                style={{ backgroundColor: size === textSize ? 'lightgray' : 'white'}}
            >
              <FormatSizeIcon fontSize={textSize as TextSize} />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default TextSizePicker;
