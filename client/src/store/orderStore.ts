import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ItemState = {
  items: Item[];
  selectedItems: string[];
};

export type Item = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  quantity?: number;
  discount?: number;
  isVeg?: boolean;
  status?: string;
  preparationTime?: number;
};

export type ItemAction = {
  addItem: (item: Item) => void;
  removeItem: (id: string[]) => void;
  updateItem: (id: string, item: Item) => void;

  updateSelectedItems: (ids: string[]) => void;
};

export const useItemStore = create<ItemAction & ItemState>()(
  persist(
    (set) => ({
      items: [],
      selectedItems: [],
      addItem: (item: Item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (ids: string[]) =>
        set((state) => ({
          items: state.items.filter((item) => !ids.includes(item.id)),
        })),
      // Update Item
      updateItem: (id: string, updatedItem: Item) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? updatedItem : item
          ),
        })),

      updateSelectedItems: (ids: string[]) =>
        set((state) => ({
          selectedItems: ids,
        })),
    }),
    {
      name: "item-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
