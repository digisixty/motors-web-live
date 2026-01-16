import React, { ReactNode } from "react";
import HomeHeader1 from "@/components/containers/homeHeader1";
import Footer from "@/components/containers/footer1";

function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <HomeHeader1 variant="light" className="" />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
