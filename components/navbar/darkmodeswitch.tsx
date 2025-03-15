import React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export const DarkMode = () => {
  const { setTheme, resolvedTheme } = useNextTheme();
  return (
    <DarkModeSwitch
      checked={resolvedTheme === "dark" ? true : false}
      onChange={(e) => setTheme(e ? "dark" : "light")}
      size={20}
    />
  );
};
