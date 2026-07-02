"use client";

import { createContext, useContext, useState } from "react";

const MenuContext = createContext<{
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
  heroActive: boolean;
  setHeroActive: (active: boolean) => void;
}>({
  menuOpen: false,
  setMenuOpen: () => {},
  preloaderDone: false,
  setPreloaderDone: () => {},
  heroActive: false,
  setHeroActive: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [heroActive, setHeroActive] = useState(false);
  return (
    <MenuContext.Provider
      value={{ menuOpen, setMenuOpen, preloaderDone, setPreloaderDone, heroActive, setHeroActive }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
