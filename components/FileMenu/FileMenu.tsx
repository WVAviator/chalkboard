import {
  SpeedDial,
  SpeedDialAction,
} from '@mui/material';
import React from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CloseIcon from '@mui/icons-material/Close';
import styles from './FileMenu.module.css';

interface FileMenuOption {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}

interface FileMenuProps {
  options: FileMenuOption[];
}

const FileMenu: React.FC<FileMenuProps> = ({ options }) => {
  return (
    <div className={styles.container}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        icon={<FolderOpenIcon />}
        openIcon={<CloseIcon />}
        direction="down"
        sx={{ position: 'absolute', top: '-1.5rem', left: 0 }}
      >
        {options.map((option) => (
          <SpeedDialAction
            key={option.label}
            icon={option.icon}
            tooltipTitle={option.label}
            onClick={option.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default FileMenu;
