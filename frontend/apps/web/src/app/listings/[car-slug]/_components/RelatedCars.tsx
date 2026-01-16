"use client";

import { useGetCarListings } from "@workspace/api";
import { TCar } from "@/app/listings/(listing-page)/_components/types";
import CarCard from "@/app/listings/(listing-page)/_components/carCard";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CAR_DETAILS } from "@/constants/app-routes";

interface RelatedCarsProps {
  currentCarSlug: string | undefined;
  manufacturerId?: number | null;
  pageSize?: number;
  onHasContent?: (hasContent: boolean) => void;
}

const RelatedCars = ({
  currentCarSlug,
  manufacturerId,
  pageSize = 10,
  onHasContent,
}: RelatedCarsProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 1280px)": { slidesToScroll: 4 },
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Fetch related cars - either from same manufacturer or general listings
  const { data: listingsData, isLoading } = useGetCarListings({
    pageNumber: 1,
    pageSize,
    isSold: false, // Only show available cars
    ...(manufacturerId && { manufacturerId }),
  });

  // Filter out the current car from the results
  const relatedCars =
    listingsData?.items?.filter(
      (car: TCar) => car.slug !== currentCarSlug && car.slug !== undefined,
    ) || [];

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    onHasContent?.(relatedCars.length > 0);
  }, [relatedCars, onHasContent]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          Related Vehicles
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-80 rounded-xl bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedCars.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          Related Vehicles
        </h2>
        <div className="flex gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white p-0 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={scrollPrev}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white p-0 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={scrollNext}
            disabled={currentIndex === scrollSnaps.length - 1}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {relatedCars.map((car: TCar) => (
            <Link
              href={`${CAR_DETAILS}/${car?.slug}`}
              key={car.id}
              className="flex-[0_0_calc(100vw-2rem)] sm:flex-[0_0_calc(50vw-1.5rem)] md:flex-[0_0_calc(40vw-1.8rem)] lg:flex-[0_0_calc(33.333vw-1.5rem)] xl:flex-[0_0_calc(25vw-1.125rem)] 2xl:flex-[0_0_calc(20vw-1rem)]"
            >
              <CarCard {...car} />
            </Link>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedCars;
