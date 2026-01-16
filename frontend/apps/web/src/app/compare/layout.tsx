import Footer from "@/components/containers/footer1";
import HomeHeader1 from "@/components/containers/homeHeader1";
import React, { ReactNode } from "react";

function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="h-full">
      <HomeHeader1 variant="light" />
      <div className="container mx-auto px-4">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
