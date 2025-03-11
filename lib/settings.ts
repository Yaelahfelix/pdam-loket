"use client";

import { MenuGroup } from "@/types/settings";

export const setSidebar = (sidebar: MenuGroup[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("sidebar", JSON.stringify(sidebar));
  }
};

export const deleteSidebar = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sidebar");
  }
};

export const getSidebar = (): MenuGroup[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const sideBar = localStorage.getItem("sidebar");
  if (!sideBar) {
    return null;
  }

  try {
    return JSON.parse(sideBar) as MenuGroup[];
  } catch (error) {
    console.error("Error parsing sidebar from localStorage:", error);
    return null;
  }
};
