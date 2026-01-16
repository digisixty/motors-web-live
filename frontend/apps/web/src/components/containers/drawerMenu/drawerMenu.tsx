"use client";

import { useMemo, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { ReactNode } from "react";
import { DrawerMenuProps, MenuItem, SubMenuItem } from "./types";
import { SubMenuDrawer } from "./SubMenuDrawer";
import { useGetCarAttributes } from "@workspace/api";
import { menuItems } from "./utils";

export function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const { data } = useGetCarAttributes();
  const catType = data?.find((a) => a.slug === "car-type");

  const [activeSubMenu, setActiveSubMenu] = useState<{
    title: string;
    items?: SubMenuItem[];
    children?: ReactNode;
  } | null>(null);

  const isSubMenuOpen = !!activeSubMenu;

  const handleSubMenuClose = () => {
    setActiveSubMenu(null);
  };

  const handleSubMenuOpen = (menuItem: MenuItem) => {
    if (menuItem.subMenu) {
      if (Array.isArray(menuItem.subMenu)) {
        setActiveSubMenu({
          title: menuItem.title,
          items: menuItem.subMenu,
        });
      } else if (typeof menuItem.subMenu === "function") {
        setActiveSubMenu({
          title: menuItem.title,
          children: menuItem.subMenu({
            onSubmenuClose: handleSubMenuClose,
            onClose: () => {
              handleSubMenuClose();
              onClose();
            },
          }),
        });
      } else {
        setActiveSubMenu({
          title: menuItem.title,
          children: menuItem.subMenu,
        });
      }
    }
  };

  const handleCloseAll = () => {
    handleSubMenuClose();
    onClose();
  };
  const finalMenuItems = useMemo(() => menuItems({ catType }), [catType]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-lg transition-opacity duration-300",
          // On mobile, hide main overlay when sub-menu is open
          activeSubMenu ? "pointer-events-none" : "",
          !activeSubMenu && isOpen && "pointer-events-auto z-50 opacity-100",
          !isOpen && "pointer-events-none opacity-0",
        )}
        onClick={handleCloseAll}
      />

      {/* Main Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-60 h-full w-full transform bg-white text-black shadow-lg transition-transform duration-300 ease-in-out lg:w-1/3",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={handleCloseAll}
              className="rounded-md p-1 transition-colors hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="font-heading space-y-1">
              {finalMenuItems?.map((item) => (
                <li key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={handleCloseAll}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleSubMenuOpen(item)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                    >
                      {item.title}
                      <ChevronRight className="size-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Sub-menu Drawer */}
      <SubMenuDrawer
        isOpen={isSubMenuOpen}
        onClose={handleSubMenuClose}
        title={activeSubMenu?.title || ""}
        items={activeSubMenu?.items}
      >
        {activeSubMenu?.children}
      </SubMenuDrawer>
    </>
  );
}
