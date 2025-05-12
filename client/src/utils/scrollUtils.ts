/**
 * Navbar scroll control utility functions
 */

import { create } from 'zustand';

interface ScrollControlProps {
  currentScrollY: number;
  lastScrollY: number;
  setVisible: (visible: boolean) => void;
  setLastScrollY: (scrollY: number) => void;
}

// Create a global store for navbar visibility state
interface NavVisibilityStore {
  isNavVisible: boolean;
  setNavVisible: (visible: boolean) => void;
}

export const useNavVisibility = create<NavVisibilityStore>((set) => ({
  isNavVisible: true,
  setNavVisible: (visible: boolean) => set({ isNavVisible: visible }),
}));

/**
 * Controls navbar visibility based on scroll direction
 */
export const controlNavbarScroll = ({
  currentScrollY,
  lastScrollY,
  setVisible,
  setLastScrollY,
}: ScrollControlProps) => {
  // Show navbar at the top of the page or when scrolling up
  if (currentScrollY <= 10 || currentScrollY < lastScrollY) {
    setVisible(true);
    useNavVisibility.getState().setNavVisible(true);
  } 
  // Hide navbar when scrolling down
  else if (currentScrollY > lastScrollY) {
    setVisible(false);
    useNavVisibility.getState().setNavVisible(false);
  }
  
  // Update last scroll position
  setLastScrollY(currentScrollY);
}; 