import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  modals: {
    customerForm: false,
    carForm: false,
    jobForm: false,
    serviceForm: false,
    paymentForm: false,
    expenseForm: false,
    inventoryItemForm: false,
    receipt: false,
  },

  selectedItem: null,

  openModal: (modalName, item = null) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
      selectedItem: item
    })),

  closeModal: (modalName) =>
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
      selectedItem: null
    })),
}));
