import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import withRightClickMenu from '../withRightClickMenu';

afterEach(cleanup);

describe('withRightClickMenu', () => {
  it('should wrap the component with the necessary functionality', () => {
    const MockComponent = () => <div>Mock Component</div>;
    const WrappedComponent = withRightClickMenu(MockComponent);

    const { getByText } = render(
      <WrappedComponent createEvent={null} id="123" color="#000000" />
    );

    expect(getByText('Mock Component')).toBeTruthy();
  });

  it('should display the right click menu when the wrapper element is right-clicked', () => {
    const MockComponent = () => <div>Mock Component</div>;
    const WrappedComponent = withRightClickMenu(MockComponent);

    const { getByText, container } = render(
      <WrappedComponent createEvent={null} id="123" color="#000000" />
    );

    fireEvent.contextMenu(container.querySelector('#wrapper'));

    expect(getByText('Delete')).toBeTruthy();
  });

  it('should close the right click menu when an item is clicked or the menu is closed', () => {
    const MockComponent = () => <div>Mock Component</div>;
    const WrappedComponent = withRightClickMenu(MockComponent);

    const { getByText, container } = render(
      <WrappedComponent createEvent={null} id="123" color="#000000" />
    );

    fireEvent.contextMenu(container.querySelector('#wrapper'));
    fireEvent.click(getByText('Delete'));

    expect(container.querySelector('#contextmenu-delete')).toBeFalsy();
  });
});
