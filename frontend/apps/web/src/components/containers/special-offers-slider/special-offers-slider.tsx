import Image from "next/image";
import React from "react";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useCallback, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CDN_BASE_URL } from "@/constants/urls";
import { cn } from "@/lib/utils";
import PriceRenderer from "@/lib/priceRenderer";
import Link from "next/link";
import { CAR_DETAILS } from "@/constants/app-routes";

interface SpecialOfferCar {
  slug: string;
  name: string;
  image: string;
  price: number;
  bgColor?: string;
}

function SpecialOffersSlider({ cars }: { cars?: SpecialOfferCar[] }) {
  // Use provided cars or fallback to empty array
  const displayCars = cars || [];
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const initializedRef = useRef(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    embla.on("select", onSelect);

    // Only initialize on first mount to avoid synchronous state update
    if (!initializedRef.current) {
      initializedRef.current = true;
      // Use setTimeout to defer the state update to avoid synchronous setState in effect
      setTimeout(() => {
        setSelectedIndex(embla.selectedScrollSnap());
      }, 0);
    }

    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  const scrollPrev = () => embla?.scrollPrev();
  const scrollNext = () => embla?.scrollNext();

  return (
    <div
      className="relative w-full overflow-hidden bg-[#cfd1d3] transition-colors"
      style={{ backgroundColor: displayCars?.[selectedIndex]?.bgColor }}
    >
      {/* -------------------------------------- */}
      {/* FIXED CONTROLS & FADE CHANGING CONTENT */}
      {/* -------------------------------------- */}
      <div
        key={selectedIndex}
        className="absolute top-8 left-4 z-20 opacity-100 transition-opacity duration-500 md:top-8 md:left-8"
      >
        <Link
          href={`${CAR_DETAILS}/${displayCars?.[selectedIndex]?.slug}`}
          className="bg-black px-6 py-2 text-white not-visited:rounded-md hover:bg-black/80"
        >
          Explore
        </Link>

        <div className="mt-8 text-2xl font-light">
          <PriceRenderer price={displayCars?.[selectedIndex]?.price || 0} />
        </div>
      </div>

      {/* ARROW CONTROLS (FIXED) */}
      <div className="absolute top-8 right-8 z-20 flex gap-3">
        <button
          onClick={scrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={scrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ---------------- */}
      {/* EMBLA SLIDES     */}
      {/* ---------------- */}
      <div ref={emblaRef} className="overflow-hidden pt-32 pb-4">
        <div className="flex select-none">
          {displayCars.map((car, idx) => {
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={idx}
                className="relative flex flex-[0_0_90%] items-center justify-center md:flex-[0_0_55%] xl:flex-[0_0_50%]"
              >
                <div
                  className={cn(
                    "relative h-80 w-full cursor-pointer transition-transform duration-500 md:h-96",
                    isSelected
                      ? "scale-100"
                      : "scale-[0.8] opacity-70 hover:scale-[0.9]",
                  )}
                  onClick={() => embla?.scrollTo(idx)}
                >
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="pointer-events-none object-contain"
                    draggable={false}
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 55vw, 50vw"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <h1 className="mt-2 px-4 text-center text-lg font-semibold md:text-2xl 2xl:text-4xl">
          {displayCars?.[selectedIndex]?.name || ""}
        </h1>
      </div>

      {/* ----------------------- */}
      {/* COMPARE MODELS (FIXED) */}
      {/* ----------------------- */}
      <div className="inset-x-0 mb-4 flex flex-col items-center">
        <div className="mb-4 w-[80%]">
          {/* ----------------------- */}
          {/* STEP-STYLE INDICATOR   */}
          {/* ----------------------- */}
          <div className="flex h-[3px] w-full">
            {displayCars.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-1 transition-colors duration-300",
                  idx === selectedIndex ? "bg-black" : "bg-black/30",
                )}
              />
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium hover:opacity-60">
          Compare models →
        </button>
      </div>
    </div>
  );
}

export default SpecialOffersSlider;
