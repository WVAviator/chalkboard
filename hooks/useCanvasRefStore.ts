import create from 'zustand';

export interface CanvasRefStore {
  canvasRef: React.MutableRefObject<HTMLElement | null>;
  setCanvasRef: (ref: React.MutableRefObject<HTMLElement | null>) => void;
  canvasRect: DOMRect | null;
}

export const useCanvasRefStore = create<CanvasRefStore>((set, get) => ({
  canvasRef: null,
  setCanvasRef: (ref) => {
    set({ canvasRef: ref, canvasRect: ref.current.getBoundingClientRect() });
  },
  canvasRect: null,
}));
