"use client";

import { Suspense } from "react";
import CarCard from "../_components/carCard";
import { TCar } from "../_components/types";
import PaginationBox from "@/components/ui/pagination-box";
import { useGetCarListings } from "@workspace/api";
import { CDN_BASE_URL } from "@/constants/urls";
import Link from "next/link";
import { CAR_DETAILS } from "@/constants/app-routes";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Car, RotateCcw } from "lucide-react";
import { useCarListingQueryParams } from "@/hooks/useCarListingQueryParams";
import { Skeleton } from "@/components/ui/skeleton";

function ListingsPageContent() {
  const { page, getApiParams, hasActiveFilters, resetAllFilters } =
    useCarListingQueryParams();

  const { data, isLoading, error, refetch } = useGetCarListings(getApiParams());

  // Reset filters function
  const resetFilters = () => {
    resetAllFilters();
  };

  // Transform API data to match TCar interface
  const transformCarData = (car: any): TCar => {
    return {
      ...car,
    };
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cars</h1>
          {/* <div>Compare cars</div> */}
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cars</h1>
          <div>Compare cars</div>
        </div>
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Car className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Error loading cars. Please try again.</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              Problem fetching car listings from the server.
            </EmptyDescription>
            {hasActiveFilters && (
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="mt-2"
              >
                <RotateCcw className="mr-2 size-4" />
                Retry
              </Button>
            )}
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const cars = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  // Show empty state when no cars found
  if (!isLoading && !error && cars.length === 0) {
    return (
      <div>
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cars</h1>
          <div>Compare cars</div>
        </div>
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Car className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No cars found</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              {hasActiveFilters
                ? "We couldn't find any cars matching your selected filters. Try adjusting your filters or reset them to see all available cars."
                : "There are no cars available at the moment. Please check back later."}
            </EmptyDescription>
            {hasActiveFilters && (
              <Button onClick={resetFilters} variant="outline" className="mt-2">
                <RotateCcw className="mr-2 size-4" />
                Reset Filters
              </Button>
            )}
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{totalCount} Cars</h1>
        <div>Compare cars</div>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-3">
        {cars?.map((item) => {
          return (
            <Link key={item?.id} href={`${CAR_DETAILS}/${item?.slug}`}>
              <CarCard {...item} />
            </Link>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationBox
            currentPage={page}
            totalPages={totalPages}
            hasPreviousPage={data?.hasPreviousPage}
            hasNextPage={data?.hasNextPage}
          />
        </div>
      )}
    </div>
  );
}

function ListingsPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
}

export default ListingsPageClient;
