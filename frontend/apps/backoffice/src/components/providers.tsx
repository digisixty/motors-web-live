"use client";

import ReactQueryProvider from "@workspace/api/reactQueryProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { DialogProvider } from "@/contexts/dialog-context";
import { GlobalDialog } from "@/components/global-dialog";
// Import the apiService to apply the 401 interceptor
import "@/services/apiService";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        // enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <DialogProvider>
          {children}
          <GlobalDialog />
          <Toaster />
        </DialogProvider>
      </NextThemesProvider>
    </ReactQueryProvider>
  );
}
