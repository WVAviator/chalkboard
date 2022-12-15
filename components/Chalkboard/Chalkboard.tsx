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
      {/* TODO: Temporary button for testing, should replace with Toolbar component */}
      <button
        onClick={() => {
          if (activeComponent === 'svg') {
            setActiveComponent(null);
          } else {
            setActiveComponent('svg');
          }
        }}
        style={{ position: 'absolute' }}
      >
        svg
      </button>
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
