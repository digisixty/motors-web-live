import { ReactNode } from "react";

export interface SubMenuItem {
  title: string;
  href: string;
  description?: string;
}

// Sub-menu drawer component
export interface SubMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items?: SubMenuItem[];
  children?: ReactNode;
}

export interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MenuItem {
  title: string;
  href?: string;
  description?: string;
  subMenu?:
    | SubMenuItem[]
    | ReactNode
    | (({
        onSubmenuClose,
        onClose,
      }: {
        onSubmenuClose: () => void;
        onClose: () => void;
      }) => ReactNode);
}
