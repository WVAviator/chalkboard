import React from 'react';
import { render, cleanup, act, renderHook } from '@testing-library/react';
import withSelectable from '../withSelectable';
import { PaintableComponentProps } from '../../components/ComponentCanvas/ComponentCanvas';
import { useSelectionStore } from '../../hooks/useSelectionStore';

afterEach(cleanup);

describe('withSelectable', () => {
  it('should wrap the component with the necessary functionality', () => {
    const MockComponent = React.forwardRef<
      HTMLDivElement,
      PaintableComponentProps
    >(({}, ref) => {
      return <div ref={ref}>Mock Component</div>;
    });
    const WrappedComponent = withSelectable(MockComponent);

    const { getByText } = render(
      <WrappedComponent createEvent={null} id="123" color="#000000" />
    );

    expect(getByText('Mock Component')).toBeTruthy();
  });

  it('should add the wrapped component to the selectionStore when it is mounted, and remove it when it is unmounted', () => {
    const MockComponent = React.forwardRef<
      HTMLDivElement,
      PaintableComponentProps
    >(({}, ref) => {
      return <div ref={ref}>Mock Component</div>;
    });
    const WrappedComponent = withSelectable(MockComponent);

    const { unmount } = render(
      <WrappedComponent createEvent={null} id="123" color="#000000" />
    );

    const { result } = renderHook(() => useSelectionStore());

    expect(result.current.selectableElements).toHaveLength(1);

    act(() => {
      unmount();
    });

    expect(result.current.selectableElements).toHaveLength(0);
  });
});
