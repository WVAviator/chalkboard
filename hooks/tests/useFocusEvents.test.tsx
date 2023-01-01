import { render, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import useFocusEvents from '../useFocusEvents';

describe('useFocusEvents', () => {
  test('returns hasFocus as false when no element within the ref has focus', () => {
    const TestHook: React.FC = () => {
      const focusRef = React.useRef<HTMLDivElement>(null);
      const { hasFocus } = useFocusEvents(focusRef);
      return (
        <div ref={focusRef}>
          <div data-testid="has-focus">{hasFocus.toString()}</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestHook />);
    expect(getByTestId('has-focus').textContent).toBe('false');
  });

  test('returns hasFocus as true when an element within the ref has focus', async () => {
    const TestHook: React.FC = () => {
      const focusRef = React.useRef<HTMLDivElement>(null);
      const { hasFocus } = useFocusEvents(focusRef);
      return (
        <div ref={focusRef}>
          <input data-testid="input" type="text" />
          <div data-testid="has-focus">{hasFocus.toString()}</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestHook />);
    const input = getByTestId('input');

    fireEvent.focus(input);

    expect(getByTestId('has-focus').textContent).toBe('true');
  });

  test('calls onFocusIn when an element within the ref receives focus', () => {
    const onFocusIn = jest.fn();
    const TestHook: React.FC = () => {
      const focusRef = React.useRef<HTMLDivElement>(null);
      useFocusEvents(focusRef, onFocusIn);
      return (
        <div ref={focusRef}>
          <input data-testid="input" type="text" />
        </div>
      );
    };

    const { getByTestId } = render(<TestHook />);
    const input = getByTestId('input');
    fireEvent.focus(input);
    expect(onFocusIn).toHaveBeenCalled();
  });

  test('calls onFocusOut when an element within the ref loses focus', () => {
    const onFocusOut = jest.fn();
    const TestHook: React.FC = () => {
      const focusRef = React.useRef<HTMLDivElement>(null);
      useFocusEvents(focusRef, null, onFocusOut);
      return (
        <div ref={focusRef}>
          <input data-testid="input" type="text" />
        </div>
      );
    };

    const { getByTestId } = render(<TestHook />);
    const input = getByTestId('input');
    fireEvent.focus(input);
    expect(onFocusOut).not.toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onFocusOut).toHaveBeenCalled();
  });
});
