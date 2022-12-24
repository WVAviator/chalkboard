import React, { useEffect } from 'react';
import ActiveComponentProvider from '../ActiveComponentProvider/ActiveComponentProvider';
import ComponentCanvas from '../ComponentCanvas/ComponentCanvas';
import styles from './Chalkboard.module.css';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Crop75Icon from '@mui/icons-material/Crop75';
import GestureIcon from '@mui/icons-material/Gesture';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UserProfile from '../UserProfile/UserProfile';
import MyChalkboards from '../MyChalkboards/MyChalkboards';
import FileMenu from '../FileMenu/FileMenu';
import TitleDisplay from '../TitleDisplay/TitleDisplay';
import ColorPicker from '../ColorPicker/ColorPicker';
import TextSizePicker from '../TextSizePicker/TextSizePicker';
import ToastNotification, {
  ToastNotificationData,
} from '../ToastNotification/ToastNotification';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';

const Chalkboard: React.FC = () => {
  const chalkboardState = useChalkboardDataStore();

  const [activeComponent, setActiveComponent] = React.useState<string | null>(
    null
  );
  const [activeComponentProps, setActiveComponentProps] = React.useState<any>({
    color: '#FFFFFF',
    textSize: 'medium',
  });
  const [myChalkboardsModalOpen, setMyChalkboardsModalOpen] =
    React.useState<boolean>(false);

  const [toastNotification, setToastNotification] =
    React.useState<ToastNotificationData>({
      message: '',
      open: false,
      severity: 'success',
    });

  useEffect(() => {
    chalkboardState.loadFromLocalStorage();
  }, []);

  const toolbarItems = [
    {
      icon: <GestureIcon />,
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
      icon: <Crop75Icon />,
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
      icon: <FormatSizeIcon />,
      selected: activeComponent === 'text',
      onClick: () => {
        if (activeComponent === 'text') {
          setActiveComponent(null);
        } else {
          setActiveComponent('text');
        }
      },
    },
  ];

  const fileMenuOptions = [
    {
      label: 'New',
      onClick: () => {
        chalkboardState.resetChalkboard();
        setActiveComponent(null);
        setActiveComponentProps({
          color: '#FFFFFF',
          textSize: 'medium',
        });
      },
      icon: <NoteAddIcon />,
    },
    {
      label: 'Open',
      onClick: () => {
        setMyChalkboardsModalOpen(true);
      },
      icon: <FileOpenIcon />,
    },
    {
      label: 'Save',
      onClick: () =>
        chalkboardState.saveToDatabase(
          false,
          (message) => {
            setToastNotification({
              message,
              open: true,
              severity: 'success',
            });
          },
          (message) => {
            setToastNotification({
              message,
              open: true,
              severity: 'error',
            });
          }
        ),
      icon: <SaveIcon />,
    },
    {
      label: 'Save As',
      onClick: () =>
        chalkboardState.saveToDatabase(
          true,
          (message) => {
            setToastNotification({
              message,
              open: true,
              severity: 'success',
            });
          },
          (message) => {
            setToastNotification({
              message,
              open: true,
              severity: 'error',
            });
          }
        ),
      icon: <SaveAsIcon />,
    },
  ];

  const handleLogin = () => {
    chalkboardState.saveToLocalStorage();
  };

  const handleLogout = () => {
    chalkboardState.saveToLocalStorage();
  };

  const handleMyChalkboards = () => {
    setMyChalkboardsModalOpen(true);
  };

  const handleLoadCanvas = async (chalkboardId: string) => {
    chalkboardState.loadFromDatabase(chalkboardId, null, (message) => {
      setToastNotification({
        message,
        open: true,
        severity: 'error',
      });
    });
  };

  return (
    <div className={styles.chalkboard}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <FileMenu options={fileMenuOptions} />
          <TitleDisplay
            title={chalkboardState.chalkboardTitle}
            setTitle={chalkboardState.updateTitle}
          />
        </div>
        <div className={styles.tools}>
          <CanvasToolbar items={toolbarItems} />
          <ColorPicker
            color={activeComponentProps.color}
            setColor={(color) => {
              setActiveComponentProps((activeComponentProps: any) => ({
                ...activeComponentProps,
                color,
              }));
            }}
          />
          <TextSizePicker
            size={activeComponentProps.textSize}
            setSize={(size) =>
              setActiveComponentProps((activeComponentProps: any) => ({
                ...activeComponentProps,
                textSize: size,
              }))
            }
          />
        </div>
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
        />
      </ActiveComponentProvider>
      <ToastNotification
        toastNotification={toastNotification}
        setToastNotification={setToastNotification}
      />
    </div>
  );
};

export default Chalkboard;
