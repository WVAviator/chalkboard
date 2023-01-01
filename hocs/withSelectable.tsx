import React from 'react';
import {
  PaintableComponent,
  PaintableComponentProps,
} from '../components/ComponentCanvas/ComponentCanvas';
import { useSelectionStore } from '../hooks/useSelectionStore';

const withSelectable = <P extends PaintableComponentProps>(
  WrappedComponent: PaintableComponent
) => {
  return (props: P) => {
    const { addSelectableElement, removeSelectableElement } = useSelectionStore(
      (state) => ({
        addSelectableElement: state.addSelectableElement,
        removeSelectableElement: state.removeSelectableElement,
      })
    );

    const wrappedComponentRef = React.createRef<HTMLElement>();
    React.useEffect(() => {
      const componentId = wrappedComponentRef.current?.id;
      addSelectableElement(wrappedComponentRef.current);
      return () => {
        removeSelectableElement(componentId);
      };
    }, []);

    return <WrappedComponent ref={wrappedComponentRef} {...props} />;
  };
};

export default withSelectable;
