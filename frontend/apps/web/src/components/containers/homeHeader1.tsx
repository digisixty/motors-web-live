"use client";

import { cn } from "@/lib/utils";
import { Menu, User } from "lucide-react";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useState } from "react";
import { DrawerMenu } from "./drawerMenu/drawerMenu";
import { AUTH_LOGIN, HOME } from "@/constants/app-routes";

function HomeHeader1({
  className,
  variant = "transparent",
}: {
  className?: string;
  variant?: "transparent" | "light";
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rootClasses = cva("w-full py-8 px-4", {
    variants: {
      variant: {
        transparent: "from-black to-transparent bg-linear-to-b text-white",
        light: "bg-white text-black border-b border-neutral-200",
      },
    },
  });

  return (
    <header className={rootClasses({ variant, className })}>
      <div className="container mx-auto flex items-center justify-between">
        <div
          className="-m-4 flex cursor-pointer items-center justify-center gap-2 p-4 text-xs"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="mt-0.5 size-4" />
          <span className="font-heading hidden md:block">MENU</span>
        </div>

        <Link
          href={HOME}
          className="font-heading absolute left-1/2 -translate-x-1/2 transform text-center text-xs font-medium select-none md:text-sm lg:text-lg lg:font-bold xl:text-xl"
        >
          MATTHEOS IOANNOU MOTORS
        </Link>

        <Link href={AUTH_LOGIN}>
          <div className="-my-4 cursor-pointer px-4 py-4">
            <User className="size-4" />
          </div>
        </Link>
      </div>
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}

export default HomeHeader1;
