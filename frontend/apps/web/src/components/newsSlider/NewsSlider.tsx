"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { NewsSliderProps } from "./types";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NewsSlider = ({ slides, className = "" }: NewsSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      dragFree: false,
    },
    [Autoplay({ playOnInit: true, delay: 5000, stopOnInteraction: false })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const togglePlayPause = useCallback(() => {
    if (emblaApi) {
      const autoplay = emblaApi.plugins()?.autoplay;
      if (autoplay) {
        if (isPlaying) {
          autoplay.stop();
        } else {
          autoplay.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  }, [emblaApi, isPlaying]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!slides || slides.length === 0) {
    return (
      <div className={`relative w-full rounded-lg bg-gray-100 ${className}`}>
        <div className="flex aspect-[16/9] h-full items-center justify-center md:aspect-[21/9]">
          <p className="text-gray-500">No news articles available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen-minus-header relative w-full ${className}`}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative aspect-[16/9] min-w-full md:aspect-[21/9]"
            >
              {/* Background Image with gradient overlay (desktop only) */}
              <div className="absolute inset-0">
                <Image
                  src={slide.featuredImageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                {/* Gradient overlay from bottom to middle (desktop only) */}
                <div className="absolute inset-0 hidden bg-linear-to-t from-black/80 via-black/60 via-50% to-transparent md:block" />
              </div>

              {/* Mobile: Play/Pause button on bottom right */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 bottom-4 z-10 border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 md:hidden"
                onClick={togglePlayPause}
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              {/* Desktop: Content overlay at bottom left */}
              <div className="absolute right-0 bottom-0 left-0 hidden p-6 md:block md:p-8 lg:p-12">
                <div className="max-w-4xl">
                  <Link href={`/news/${slide.slug}`}>
                    <h2 className="mb-2 cursor-pointer text-xl font-bold text-white transition-colors hover:text-gray-200 sm:text-2xl md:mb-3 md:text-3xl lg:text-4xl">
                      {slide.title}
                    </h2>
                  </Link>
                  <p className="mb-2 text-xs text-white/90 sm:text-sm md:mb-3 md:text-base">
                    {new Date(slide.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm md:line-clamp-3 md:text-base lg:text-lg">
                    {slide.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:left-4 md:flex"
        onClick={scrollPrev}
        disabled={prevBtnDisabled}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 border-white/20 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:right-4 md:flex"
        onClick={scrollNext}
        disabled={nextBtnDisabled}
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {/* Mobile: Title, Description, and Dots */}
      <div className="mt-4 md:hidden">
        {slides[selectedIndex] && (
          <div className="mb-4">
            <Link href={`/news/${slides[selectedIndex].slug}`}>
              <h2 className="mb-2 cursor-pointer text-xl font-bold text-gray-900 transition-colors hover:text-gray-700 sm:text-2xl md:text-3xl dark:text-white dark:hover:text-gray-300">
                {slides[selectedIndex].title}
              </h2>
            </Link>
            <p className="mb-2 text-xs text-gray-600 sm:text-sm md:text-base dark:text-gray-400">
              {new Date(slides[selectedIndex].date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base dark:text-gray-300">
              {slides[selectedIndex].shortDescription}
            </p>
          </div>
        )}

        {/* Mobile: Navigation dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "w-8 bg-gray-900 dark:bg-white"
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NewsSlider);
