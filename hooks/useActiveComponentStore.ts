import create from 'zustand';

export interface ActiveComponentStore {
  activeComponent: string | null;
  activeComponentProps: any;
  toggleActiveComponent: (component: string) => void;
  updateColor: (color: string) => void;
  updateTextSize: (textSize: string) => void;
  resetActiveComponent: () => void;
  reset: () => void;
}

export const useActiveComponentStore = create<ActiveComponentStore>((set) => ({
  activeComponent: null,
  activeComponentProps: {
    color: '#FFFFFF',
    textSize: 'medium',
  },
  toggleActiveComponent: (component: string) =>
    set((state) => ({
      activeComponent: component === state.activeComponent ? null : component,
    })),
  updateColor: (color: string) =>
    set((state) => ({
      activeComponentProps: { ...state.activeComponentProps, color },
    })),
  updateTextSize: (textSize: string) =>
    set((state) => ({
      activeComponentProps: { ...state.activeComponentProps, textSize },
    })),
  resetActiveComponent: () => set({ activeComponent: null }),
  reset: () =>
    set({
      activeComponent: null,
      activeComponentProps: { color: '#FFFFFF', textSize: 'medium' },
    }),
}));
