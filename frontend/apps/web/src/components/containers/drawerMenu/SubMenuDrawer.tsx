import { cn } from "@/lib/utils";
import Link from "next/link";
import { X } from "lucide-react";
import { SubMenuDrawerProps } from "./types";

export function SubMenuDrawer({
  isOpen,
  onClose,
  title,
  items,
  children,
}: SubMenuDrawerProps) {
  return (
    <>
      {/* Overlay for sub-menu */}
      <div
        className={cn(
          "fixed inset-0 bg-transparent",
          // Ensure overlay is above main drawer
          "z-50",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sub-menu Drawer */}
      <div
        className={cn(
          // Base styles
          "fixed z-60 transform bg-stone-200 text-black shadow-xl transition-all duration-300 ease-in-out md:z-50",
          // Mobile: top of main drawer, slides down from top
          "top-0 left-0 h-full w-full",
          // Desktop: right of main drawer, slides in from right
          "md:top-0 md:left-1/3 md:h-full md:w-1/3 md:translate-x-0",
          // Closed states
          !isOpen && "pointer-events-none opacity-0 md:-translate-x-full",
          // Open states
          isOpen && "opacity-100 md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 transition-colors hover:bg-gray-100"
              aria-label="Close sub-menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Sub-menu Content */}
          <nav className="flex-1 overflow-y-auto p-4">
            {children ? (
              children
            ) : items ? (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md p-3 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={onClose}
                    >
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>
        </div>
      </div>
    </>
  );
}
