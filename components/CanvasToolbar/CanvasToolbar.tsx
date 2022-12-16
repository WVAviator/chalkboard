import { Button, ButtonGroup } from '@mui/material';
import React from 'react';
import styles from './CanvasToolbar.module.css';

export interface CanvasToolbarItem {
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

interface CanvasToolbarProps {
  items: CanvasToolbarItem[];
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ items }) => {
  return (
    <ButtonGroup
      color="secondary"
      className={styles.toolbar}
      variant="contained"
    >
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            onClick={item.onClick}
            sx={{
              backgroundColor: item.selected
                ? 'primary.main'
                : 'secondary.main',
            }}
          >
            {item.icon}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default CanvasToolbar;
