import { create } from 'zustand';

interface PropertyListingModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePropertyListingModal = create<PropertyListingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default usePropertyListingModal;