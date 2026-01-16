"use client";

import Sidebar from "@/app/listings/(listing-page)/_components/sidebar/sidebar";
import Footer from "@/components/containers/footer1";
import HomeHeader1 from "@/components/containers/homeHeader1";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import React, { ReactNode, Suspense, useState } from "react";

function Layout({ children }: { children?: ReactNode }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="h-full">
      <HomeHeader1 variant="light" />
      <div className="container mx-auto px-4">
        {/* Mobile Filter Button */}
        <div className="flex items-center gap-4 pt-8 md:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <Filter className="size-4" />
                Filters
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full overflow-y-auto px-8 pt-16 sm:max-w-sm"
            >
              <div className="py-4">
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-4">
                      <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
                      <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  }
                >
                  <Sidebar />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden w-64 shrink-0 py-8 md:block">
            <Suspense
              fallback={
                <div className="flex flex-col gap-4">
                  <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
                </div>
              }
            >
              <Sidebar />
            </Suspense>
          </div>
          {/* Main Content */}
          <div className="flex-1 py-8">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
