import React, { useEffect } from 'react';
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
import ToastNotification from '../ToastNotification/ToastNotification';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import { useActiveComponentStore } from '../../hooks/useActiveComponentStore';
import { useToastNotificationStore } from '../../hooks/useToastNotificationStore';
import { useModalStore } from '../../hooks/useModalStore';
import SelectionManager from '../SelectionManager/SelectionManager';
import MoveableManager from '../MoveableManager/MoveableManager';

const Chalkboard: React.FC = () => {
  const chalkboardState = useChalkboardDataStore();
  const activeComponentState = useActiveComponentStore();
  const { openMyChalkboardsModal } = useModalStore((state) => ({
    openMyChalkboardsModal: state.openMyChalkboardsModal,
  }));

  const showToastNotification = useToastNotificationStore(
    (state) => state.showToastNotification
  );

  useEffect(() => {
    chalkboardState.loadFromLocalStorage();
  }, []);

  const toolbarItems = [
    {
      icon: <GestureIcon />,
      selected: activeComponentState.activeComponent === 'svg',
      onClick: () => activeComponentState.toggleActiveComponent('svg'),
    },
    {
      icon: <Crop75Icon />,
      selected: activeComponentState.activeComponent === 'div',
      onClick: () => activeComponentState.toggleActiveComponent('div'),
    },
    {
      icon: <CodeIcon />,
      selected: activeComponentState.activeComponent === 'code',
      onClick: () => activeComponentState.toggleActiveComponent('code'),
    },
    {
      icon: <FormatSizeIcon />,
      selected: activeComponentState.activeComponent === 'text',
      onClick: () => activeComponentState.toggleActiveComponent('text'),
    },
  ];

  const fileMenuOptions = [
    {
      label: 'New',
      onClick: () => {
        chalkboardState.resetChalkboard();
        activeComponentState.resetActiveComponent();
      },
      icon: <NoteAddIcon />,
    },
    {
      label: 'Open',
      onClick: openMyChalkboardsModal,
      icon: <FileOpenIcon />,
    },
    {
      label: 'Save',
      onClick: () =>
        chalkboardState.saveToDatabase(
          false,
          (message) => {
            showToastNotification(message, 'success');
          },
          (error) => {
            showToastNotification(error, 'error');
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
            showToastNotification(message, 'success');
          },
          (error) => {
            showToastNotification(error, 'error');
          }
        ),
      icon: <SaveAsIcon />,
    },
  ];

  const handleLoadCanvas = async (chalkboardId: string) => {
    chalkboardState.loadFromDatabase(chalkboardId, null, (error) => {
      showToastNotification(error, 'error');
    });
  };

  return (
    <div className={styles.chalkboard}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <FileMenu options={fileMenuOptions} />
          <TitleDisplay />
        </div>
        <div className={styles.tools}>
          <CanvasToolbar items={toolbarItems} />
          <ColorPicker />
          <TextSizePicker />
        </div>
        <UserProfile />
      </header>
      <MyChalkboards onSelected={handleLoadCanvas} />
      <ComponentCanvas />
      <ToastNotification />
      <SelectionManager />
      <MoveableManager />
    </div>
  );
};

export default Chalkboard;
