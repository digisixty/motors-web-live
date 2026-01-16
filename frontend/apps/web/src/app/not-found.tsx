import HomeHeader1 from "@/components/containers/homeHeader1";
import Link from "next/link";
import React from "react";
import { HOME } from "@/constants/app-routes";
import Footer from "@/components/containers/footer1";

function NotFoundPage() {
  return (
    <div className="h-full flex-col">
      <HomeHeader1 variant="light" className="" />
      <div className="container mx-auto flex h-screen flex-1 shrink-0 flex-col items-center justify-center gap-10">
        <div
          className="bg-clip-text! text-9xl text-transparent xl:text-[20rem]"
          style={{
            background:
              "linear-gradient(180deg, #d8d8db 27%, #fff 75%, transparent)",
          }}
        >
          404
        </div>
        <Link href={HOME} className="no-underline">
          <div className="rounded border border-neutral-500 px-5 py-3">
            Home
          </div>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
