import { create } from 'zustand';

export const useAlgorithmStore = create((set) => ({
  selectedCategory: 'sorting',
  selectedAlgorithm: null,
  algorithmData: null,
  customInput: '',
  
  setCategory: (selectedCategory) => set({ selectedCategory, selectedAlgorithm: null }),
  setAlgorithm: (selectedAlgorithm) => set({ selectedAlgorithm }),
  setAlgorithmData: (algorithmData) => set({ algorithmData }),
  setCustomInput: (customInput) => set({ customInput }),
}));
