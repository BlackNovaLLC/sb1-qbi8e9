import { create } from 'zustand';
import { Card } from '../types';

interface ModalState {
  isOpen: boolean;
  card: Card | null;
  columnId: string | null;
  openModal: (card: Card, columnId: string) => void;
  closeModal: () => void;
  updateCard: (updatedCard: Card) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  card: null,
  columnId: null,
  openModal: (card, columnId) => set({ isOpen: true, card, columnId }),
  closeModal: () => set({ isOpen: false, card: null, columnId: null }),
  updateCard: (updatedCard) => set((state) => ({
    ...state,
    card: updatedCard
  })),
}));