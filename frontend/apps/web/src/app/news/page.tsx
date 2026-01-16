import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NewsPageClient from "./news-page-client";

export const metadata: Metadata = {
  title: "News | Car Dealership",
};

function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mt-8 mb-8 text-2xl xl:text-3xl">News</h1>

      <Suspense
        fallback={
          <div className="grid gap-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        <NewsPageClient />
      </Suspense>
    </div>
  );
}

export default Page;
