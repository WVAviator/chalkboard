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
import MyChalkboards from '../MyChalkboards/MyChalkboards';
import FileMenu from '../FileMenu/FileMenu';

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
  const [myChalkboardsModalOpen, setMyChalkboardsModalOpen] =
    React.useState<boolean>(false);

  const [canvasId, setCanvasId] = React.useState<string | null>(null);
  const [canvasTitle, setCanvasTitle] = React.useState<string>('Untitled');

  useEffect(() => {
    const restoreCanvas = () => {
      const restoredData = localStorage.getItem('chalkboardData');
      if (restoredData) {
        const { components, title, canvasId } = JSON.parse(restoredData);

        setChalkboardData(components);
        setCanvasTitle(title);
        setCanvasId(canvasId);

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
  ];

  const fileMenuOptions = [
    {
      label: 'New',
      onClick: () => {
        setChalkboardData([]);
        setCanvasId(null);
        setCanvasTitle('Untitled');
      },
    },
    {
      label: 'Open',
      onClick: () => {
        setMyChalkboardsModalOpen(true);
      },
    },
    {
      label: 'Save',
      onClick: async () => {
        const body = {
          components: chalkboardData,
          title: canvasTitle,
          canvasId,
        };
        const fetchUrl = canvasId ? `/api/canvas/${canvasId}` : '/api/canvas';
        const response = await fetch(fetchUrl, {
          method: canvasId ? 'PATCH' : 'POST',
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
    {
      label: 'Save As',
      onClick: async () => {
        const body = {
          components: chalkboardData,
          title: canvasTitle,
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
    const data = {
      components: chalkboardData,
      title: canvasTitle,
      canvasId,
    };
    localStorage.setItem('chalkboardData', JSON.stringify(data));
  };

  const handleLogin = () => {
    localSave();
  };

  const handleLogout = () => {
    localSave();
  };

  const handleMyChalkboards = () => {
    setMyChalkboardsModalOpen(true);
  };

  const handleLoadCanvas = async (canvasId: string) => {
    setChalkboardData([]);
    const response = await fetch(`/api/canvas/${canvasId}`);
    const { data, success } = await response.json();
    if (success) {
      setChalkboardData(data.components);
      setCanvasId(data._id);
    } else {
      console.log('Error loading canvas');
    }
  };

  return (
    <div className={styles.chalkboard}>
      <header className={styles.header}>
        <FileMenu options={fileMenuOptions} />
        <CanvasToolbar items={toolbarItems} />
        <UserProfile
          onLoginAttempt={handleLogin}
          onLogout={handleLogout}
          onMyChalkboards={handleMyChalkboards}
        />
      </header>
      <MyChalkboards
        open={myChalkboardsModalOpen}
        setOpen={setMyChalkboardsModalOpen}
        onSelected={handleLoadCanvas}
      />
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
