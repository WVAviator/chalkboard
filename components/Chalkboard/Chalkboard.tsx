import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import ActiveComponentProvider from '../ActiveComponentProvider/ActiveComponentProvider';
import ComponentCanvas, {
  PaintableComponentData,
} from '../ComponentCanvas/ComponentCanvas';
import styles from './Chalkboard.module.css';

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
    //TODO: Get data from server for saved canvas or initialize new canvas
  }, []);

  return (
    <div className={styles.chalkboard}>
      {/* TODO: Temporary buttons for testing, should replace with Toolbar component */}
      <div style={{ position: 'fixed', top: '0', left: '0', zIndex: '10000' }}>
        <button
          onClick={() => {
            if (activeComponent === 'svg') {
              setActiveComponent(null);
            } else {
              setActiveComponent('svg');
            }
          }}
        >
          {' '}
          svg
        </button>
        <button
          onClick={() => {
            if (activeComponent === 'div') {
              setActiveComponent(null);
            } else {
              setActiveComponent('div');
            }
          }}
        >
          div
        </button>
      </div>
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
