"use client";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ToastProvider } from "@heroui/react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <HeroUIProvider locale="id-ID">
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        {...themeProps}
      >
        <ToastProvider />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
