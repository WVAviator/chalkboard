import React from 'react';

export type ActiveComponentState = {
  activeComponent: string | null;
  setActiveComponent: (value: string | null) => void;
};

/**
 * The ActiveComponentContext is used to store the active component. This is used by the ComponentCanvas to determine which component to draw when the user clicks on the canvas. It also enables the components themselves to update the active component.
 */
export const ActiveComponentContext = React.createContext<ActiveComponentState>(
  {
    activeComponent: null,
    setActiveComponent: () => {},
  }
);

export interface ActiveComponentProviderProps {
  value: ActiveComponentState;
  children: React.ReactNode;
}

const ActiveComponentProvider: React.FC<ActiveComponentProviderProps> = ({
  value,
  children,
}) => {
  return (
    <ActiveComponentContext.Provider value={value}>
      {children}
    </ActiveComponentContext.Provider>
  );
};

export default ActiveComponentProvider;
