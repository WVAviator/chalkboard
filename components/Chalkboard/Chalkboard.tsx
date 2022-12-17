import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import CanvasModel from '../../models/Canvas';
import ActiveComponentProvider from '../ActiveComponentProvider/ActiveComponentProvider';
import ComponentCanvas, {
  PaintableComponentData,
} from '../ComponentCanvas/ComponentCanvas';
import styles from './Chalkboard.module.css';
import CreateIcon from '@mui/icons-material/Create';
import SquareIcon from '@mui/icons-material/Square';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import UserProfile from '../UserProfile/UserProfile';

const Chalkboard: React.FC = () => {
  const [chalkboardData, setChalkboardData] = React.useState<
    PaintableComponentData[]
  >([]);
  const [activeComponent, setActiveComponent] = React.useState<string | null>(
    null
  );
  const [activeComponentProps, setActiveComponentProps] = React.useState<any>(
    {}
  );

  useEffect(() => {
    const restoreCanvas = () => {
      const restoredData = localStorage.getItem('chalkboardData');
      if (restoredData) {
        setChalkboardData(JSON.parse(restoredData));
        localStorage.removeItem('chalkboardData');
      }
    };
    restoreCanvas();
  }, []);

  const toolbarItems = [
    {
      icon: <CreateIcon />,
      selected: activeComponent === 'svg',
      onClick: () => {
        if (activeComponent === 'svg') {
          setActiveComponent(null);
        } else {
          setActiveComponent('svg');
        }
      },
    },
    {
      icon: <SquareIcon />,
      selected: activeComponent === 'div',
      onClick: () => {
        if (activeComponent === 'div') {
          setActiveComponent(null);
        } else {
          setActiveComponent('div');
        }
      },
    },
    {
      icon: <CodeIcon />,
      selected: activeComponent === 'code',
      onClick: () => {
        if (activeComponent === 'code') {
          setActiveComponent(null);
        } else {
          setActiveComponent('code');
        }
      },
    },
    {
      icon: <SaveIcon />,
      selected: false,
      onClick: async () => {
        const body = {
          components: chalkboardData,
          user: '123',
          title: 'test',
        };
        const response = await fetch('/api/canvas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.success) {
          console.log('Canvas saved');
        } else {
          console.log('Error saving canvas');
        }
      },
    },
  ];

  const localSave = () => {
    localStorage.setItem('chalkboardData', JSON.stringify(chalkboardData));
  };

  const handleLogin = () => {
    localSave();
  };

  const handleLogout = () => {
    localSave();
  };

  return (
    <div className={styles.chalkboard}>
      {/* TODO: Temporary buttons for testing, should replace with Toolbar component */}
      <CanvasToolbar items={toolbarItems} />
      <UserProfile onLoginAttempt={handleLogin} onLogout={handleLogout} />
      <ActiveComponentProvider value={{ activeComponent, setActiveComponent }}>
        <ComponentCanvas
          activeComponent={activeComponent}
          activeComponentProps={activeComponentProps}
          components={chalkboardData}
          setComponents={setChalkboardData}
        />
      </ActiveComponentProvider>
    </div>
  );
};

export default Chalkboard;
