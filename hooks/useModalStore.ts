import create from 'zustand';

export interface ModalStore {
  myChalkboardsModalOpen: boolean;
  openMyChalkboardsModal: () => void;
  closeMyChalkboardsModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  myChalkboardsModalOpen: false,
  openMyChalkboardsModal: () => set({ myChalkboardsModalOpen: true }),
  closeMyChalkboardsModal: () => set({ myChalkboardsModalOpen: false }),
}));
