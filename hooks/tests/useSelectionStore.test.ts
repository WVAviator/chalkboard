import { useSelectionStore } from '../useSelectionStore';
import { renderHook, act } from '@testing-library/react';

const createHTMLElement = (id: string) => {
  const element = document.createElement('div');
  element.id = id;
  return element;
};

const createSVGElement = (id: string) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  element.id = id;
  return element as SVGElement;
};

describe('useSelectionStore', () => {
  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useSelectionStore());
    expect(result.current.selectableElements).toEqual([]);
    expect(result.current.selectedElements).toEqual([]);
    expect(result.current.selectionEnabled).toBe(true);
  });

  it('should add and remove selectable elements correctly', () => {
    const { result } = renderHook(() => useSelectionStore());
    const element1 = createHTMLElement('1');
    const element2 = createHTMLElement('2');

    act(() => {
      result.current.addSelectableElement(element1);
      result.current.addSelectableElement(element2);
    });
    expect(result.current.selectableElements).toEqual([element1, element2]);

    act(() => {
      result.current.removeSelectableElement('1');
    });
    expect(result.current.selectableElements).toEqual([element2]);
  });

  it('should add and remove selected elements correctly', () => {
    const { result } = renderHook(() => useSelectionStore());
    const element1 = createHTMLElement('1');
    const element2 = createSVGElement('2');

    act(() => {
      result.current.addSelectedElement(element1);
      result.current.addSelectedElement(element2);
    });
    expect(result.current.selectedElements).toEqual([element1, element2]);

    act(() => {
      result.current.removeSelectedElement(element1);
    });
    expect(result.current.selectedElements).toEqual([element2]);

    act(() => {
      result.current.removeSelectedElementById('2');
    });
    expect(result.current.selectedElements).toEqual([]);
  });

  it('should enable and disable selection correctly', () => {
    const { result } = renderHook(() => useSelectionStore());
    expect(result.current.selectionEnabled).toBe(true);

    const element1 = createHTMLElement('1');

    act(() => {
      result.current.addSelectedElement(element1);
    });
    expect(result.current.selectedElements).toEqual([element1]);

    act(() => {
      result.current.setSelectionEnabled(false);
    });
    expect(result.current.selectionEnabled).toBe(false);
    expect(result.current.selectedElements).toEqual([]);

    act(() => {
      result.current.setSelectionEnabled(true);
    });
    expect(result.current.selectionEnabled).toBe(true);
  });
});
