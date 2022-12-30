import create from 'zustand';

interface SelectionStore {
  selectableElements: HTMLElement[];
  addSelectableElement: (element: HTMLElement) => void;
  removeSelectableElement: (id: string) => void;
  selectedElements: (HTMLElement | SVGElement)[];
  addSelectedElement: (element: HTMLElement | SVGElement) => void;
  removeSelectedElement: (element: HTMLElement | SVGElement) => void;
  removeSelectedElementById: (id: string) => void;
  selectionEnabled: boolean;
  setSelectionEnabled: (enabled: boolean) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectableElements: [],
  addSelectableElement: (element) =>
    set((state) => ({
      selectableElements: [...state.selectableElements, element],
    })),
  removeSelectableElement: (id) =>
    set((state) => ({
      selectableElements: state.selectableElements.filter((el) => el.id !== id),
    })),
  selectedElements: [],
  addSelectedElement: (element) =>
    set((state) => ({
      selectedElements: [...state.selectedElements, element],
    })),
  removeSelectedElement: (element) =>
    set((state) => ({
      selectedElements: state.selectedElements.filter((el) => el !== element),
    })),
  removeSelectedElementById: (id) =>
    set((state) => ({
      selectedElements: state.selectedElements.filter((el) => el.id !== id),
    })),
  selectionEnabled: false,
  setSelectionEnabled: (enabled: boolean) => set({ selectionEnabled: enabled }),
  clearSelection: () => set({ selectedElements: [] }),
}));
