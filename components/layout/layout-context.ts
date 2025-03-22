"use client";

import { createContext, Dispatch, SetStateAction, useContext } from "react";

interface SidebarContext {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContext>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
