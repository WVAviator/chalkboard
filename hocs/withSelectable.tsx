import React from 'react';
import {
  PaintableComponent,
  PaintableComponentProps,
} from '../components/ComponentCanvas/ComponentCanvas';
import { useSelectionStore } from '../hooks/useSelectionStore';

const withSelectable = <P extends PaintableComponentProps>(
  WrappedComponent: PaintableComponent
) => {
  return (
    props: P & { ref: React.RefObject<HTMLElement> }
  ) => {
    const { addSelectableElement, removeSelectableElement } = useSelectionStore(
      (state) => ({
        addSelectableElement: state.addSelectableElement,
        removeSelectableElement: state.removeSelectableElement,
      })
    );

    const ref = React.createRef<HTMLElement>();
    React.useEffect(() => {
      // if (!ref.current) return;
      addSelectableElement(ref.current);
      return () => {
        // if (!ref.current) return;
        removeSelectableElement(ref.current);
      };
    }, []);

    return <WrappedComponent ref={ref} {...props} />;
  };
};

export default withSelectable;
