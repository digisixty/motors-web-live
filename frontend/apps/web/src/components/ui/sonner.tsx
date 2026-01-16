"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[var(--toast)] flex w-full items-center gap-4 rounded-lg border p-4 shadow-lg",
          description: "text-sm opacity-90",
          actionButton:
            "group-[var(--toast-action)]:border-primary group-[var(--toast-action)]:text-primary group-[var(--toast-action)]:hover:bg-primary/90 group-[var(--toast-action)]:hover:text-primary-foreground",
          closeButton:
            "group-[var(--toast-close)]:border-muted-foreground/20 group-[var(--toast-close)]:text-muted-foreground group-[var(--toast-close)]:hover:border-muted-foreground/30 group-[var(--toast-close)]:hover:text-muted-foreground",
        },
      }}
    />
  );
}