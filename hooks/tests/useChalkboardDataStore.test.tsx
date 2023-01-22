/// <reference types="jest" />

import { useChalkboardDataStore } from '../useChalkboardDataStore';
import { renderHook, act } from '@testing-library/react';

describe('useChalkboardDataStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize the state correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());
    expect(result.current.chalkboardComponents).toEqual([]);
    expect(result.current.chalkboardId).toBe(null);
    expect(result.current.chalkboardTitle).toBe('Untitled');
  });

  it('should reset the chalkboard correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());
    act(() => {
      result.current.resetChalkboard();
    });
    expect(result.current.chalkboardComponents).toEqual([]);
    expect(result.current.chalkboardId).toBe(null);
    expect(result.current.chalkboardTitle).toBe('Untitled');
  });

  it('should load from local storage correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    // Set up test data in local storage
    const testData = {
      chalkboardComponents: [{ id: '123', type: 'text' }],
      chalkboardId: 'abc',
      chalkboardTitle: 'Test',
    };
    localStorage.setItem('chalkboardData', JSON.stringify(testData));

    act(() => {
      result.current.loadFromLocalStorage();
    });
    expect(result.current.chalkboardComponents).toEqual(
      testData.chalkboardComponents
    );
    expect(result.current.chalkboardId).toBe(testData.chalkboardId);
    expect(result.current.chalkboardTitle).toBe(testData.chalkboardTitle);
  });

  it('should add a component correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    const testComponent = {
      id: '123',
      type: 'text',
      data: {
        text: 'test',
      },
    };

    act(() => {
      result.current.addComponent(testComponent);
    });
    expect(result.current.chalkboardComponents).toEqual([testComponent]);
  });

  it('should remove a component correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    const testComponent1 = {
      id: '123',
      type: 'text',
      data: {
        text: 'test',
      },
    };

    const testComponent2 = {
      id: '456',
      type: 'image',
      data: {
        src: 'test.jpg',
      },
    };

    act(() => {
      result.current.addComponent(testComponent1);
      result.current.addComponent(testComponent2);
    });
    expect(result.current.chalkboardComponents).toEqual([
      testComponent1,
      testComponent2,
    ]);

    act(() => {
      result.current.removeComponent('123');
    });
    expect(result.current.chalkboardComponents).toEqual([testComponent2]);
  });

  it('should update a component correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    const testComponent = {
      id: '123',
      type: 'text',
      data: {
        text: 'test',
      },
    };

    act(() => {
      result.current.addComponent(testComponent);
    });
    expect(result.current.chalkboardComponents).toEqual([testComponent]);

    act(() => {
      result.current.updateComponent('123', {
        data: {
          text: 'updated',
        },
      });
    });
    expect(result.current.chalkboardComponents).toEqual([
      {
        id: '123',
        type: 'text',
        data: {
          text: 'updated',
        },
      },
    ]);
  });

  it('should update the data of a component correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    const testComponent = {
      id: '123',
      type: 'text',
      data: {
        text: 'test',
      },
    };

    act(() => {
      result.current.addComponent(testComponent);
    });
    expect(result.current.chalkboardComponents).toEqual([testComponent]);

    act(() => {
      result.current.updateComponentData('123', {
        text: 'updated',
      });
    });
    expect(result.current.chalkboardComponents).toEqual([
      {
        id: '123',
        type: 'text',
        data: {
          text: 'updated',
        },
      },
    ]);
  });

  it('should move a component correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    const testComponent1 = {
      id: '123',
      type: 'text',
      data: {
        text: 'test',
      },
    };

    const testComponent2 = {
      id: '456',
      type: 'image',
      data: {
        src: 'test.jpg',
      },
    };

    act(() => {
      result.current.addComponent(testComponent1);
      result.current.addComponent(testComponent2);
    });
    expect(result.current.chalkboardComponents).toEqual([
      testComponent1,
      testComponent2,
    ]);

    act(() => {
      result.current.moveComponent('123');
    });
    expect(result.current.chalkboardComponents).toEqual([
      testComponent2,
      testComponent1,
    ]);
  });

  it('should update the title correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    expect(result.current.chalkboardTitle).toEqual('Untitled');

    act(() => {
      result.current.updateTitle('New Title');
    });
    expect(result.current.chalkboardTitle).toEqual('New Title');
  });

  it('should reset the chalkboard correctly', () => {
    const { result } = renderHook(() => useChalkboardDataStore());

    act(() => {
      result.current.addComponent({
        id: '123',
        type: 'text',
        data: {
          text: 'test',
        },
      });
    });

    expect(result.current.chalkboardComponents).toHaveLength(1);
    expect(result.current.chalkboardId).toBeNull();
    expect(result.current.chalkboardTitle).toEqual('Untitled');

    act(() => {
      result.current.resetChalkboard();
    });
    expect(result.current.chalkboardComponents).toHaveLength(0);
    expect(result.current.chalkboardId).toBeNull();
    expect(result.current.chalkboardTitle).toEqual('Untitled');
  });

  it('saves the chalkboard to the database', async () => {
    // Create a mock fetcher function
    const fetcher = jest.fn((url, options) => {
      expect(options).toMatchObject({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components: [],
          title: 'My Chalkboard',
          canvasId: null,
        }),
      });
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
        ok: true,
        status: 200,
        statusText: 'OK',
      } as Response);
    });

    const { result } = renderHook(() => useChalkboardDataStore());

    act(() => {
      result.current.updateTitle('My Chalkboard');
      result.current.saveToDatabase(fetcher, true);
    });

    // Ensure the fetcher function was called with the correct arguments
    expect(fetcher).toHaveBeenCalledWith('/api/canvas', expect.anything());
  });

  it('loads data from the database', async () => {
    const mockFetcher = jest.fn((url, options) => {
      expect(url).toEqual('/api/canvas/123');
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: { _id: '123', components: [], title: 'test-title' },
            success: true,
          }),
      } as Response);
    });

    const { result } = renderHook(() => useChalkboardDataStore());

    const onSuccess = jest.fn();
    const onError = jest.fn();

    await act(async () => {
      result.current.loadFromDatabase(mockFetcher, '123', onSuccess, onError);
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.chalkboardId).toEqual('123');
    expect(result.current.chalkboardComponents).toEqual([]);
    expect(result.current.chalkboardTitle).toEqual('test-title');
  });
});
