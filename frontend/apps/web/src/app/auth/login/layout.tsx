import Copyright from "@/components/containers/copyright";
import { CDN_BASE_URL } from "@/constants/urls";
import Image from "next/image";
import React, { ReactNode } from "react";

function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="h-full">
      <div className="flex h-full gap-2">
        <div className="relative hidden lg:block lg:w-1/2 2xl:w-2/3">
          <Image
            src={`${CDN_BASE_URL}/cdn/static/auth-background.webp`}
            alt="bg"
            fill
            className="object-cover"
          />
        </div>
        <div className="h-full flex-1">{children}</div>
      </div>
      <Copyright />
    </div>
  );
}

export default Layout;
