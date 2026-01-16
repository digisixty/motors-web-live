"use client";
import Image from "next/image";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./dotsButtons";
import { PrevButton, NextButton, usePrevNextButtons } from "./ArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { SlideContext } from "./SlideContext";
import { ArrowLeft, ArrowRight, MoveLeft, MoveRight } from "lucide-react";

type PropType = {
  slides: {
    img: string;
    title: string;
    description: ReactNode;
    footNote: ReactNode;
  }[];
  options?: EmblaOptionsType;
};

type SlideType = {
  img: string;
  title: string;
  description: ReactNode;
  footNote: ReactNode;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  // Default autoplay time is 4000ms (4 seconds)
  const autoplayTime = 4000;

  // Modified options to handle the fake slide and alignment
  const modifiedOptions = {
    ...options,
    startIndex: 1, // Start at the first real slide (index 1, after fake slide)
    align: "center" as const,
    containScroll: "trimSnaps" as const,
    skipSnaps: true,
    draggable: true,
  };

  const [emblaRef, emblaApi] = useEmblaCarousel(modifiedOptions, [
    Autoplay({
      active: false,
      playOnInit: true,
      stopOnInteraction: false,
      delay: autoplayTime,
    }),
  ]);

  // Track the current slide index (adjusted for fake slide)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [realSlideIndex, setRealSlideIndex] = useState(0);

  // Update current slide index when slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      setCurrentSlideIndex(selected);
      // Adjust for the fake slide (subtract 1, but don't go below 0)
      setRealSlideIndex(Math.max(0, selected - 1));
    };

    emblaApi.on("select", onSelect);
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    setRealSlideIndex(Math.max(0, emblaApi.selectedScrollSnap() - 1));

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    // Always reset the autoplay timer to continue playing after interaction
    autoplay.reset();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick, autoplayProgress } =
    useDotButton(emblaApi, onNavButtonClick, autoplayTime); // We'll handle the fake slide in dotsButtons

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  // Custom navigation handlers to prevent going to fake slide
  const handlePrevButtonClick = useCallback(() => {
    if (!emblaApi) return;

    const currentSlide = emblaApi.selectedScrollSnap();
    // Prevent going to fake slide (index 0)
    if (currentSlide <= 1) return;

    onPrevButtonClick();
  }, [emblaApi, onPrevButtonClick]);

  const handleNextButtonClick = useCallback(() => {
    if (!emblaApi) return;

    onNextButtonClick();
  }, [emblaApi, onNextButtonClick]);

  // Prevent dragging to fake slide
  useEffect(() => {
    if (!emblaApi) return;

    const onScroll = () => {
      const currentSlide = emblaApi.selectedScrollSnap();
      // If user tries to go to fake slide, snap back to first real slide
      if (currentSlide === 0) {
        emblaApi.scrollTo(1, false);
      }
    };

    emblaApi.on("scroll", onScroll);
    emblaApi.on("settle", onScroll);

    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("settle", onScroll);
    };
  }, [emblaApi]);

  return (
    <section
      className="relative w-full"
      style={
        {
          "--slide-height": "fit-content",
          "--slide-spacing": "1rem",
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex w-full justify-end px-4 md:w-11/12 xl:w-10/12">
        <div className="flex items-center justify-center gap-4">
          <ArrowLeft
            className={`cursor-pointer ${
              currentSlideIndex <= 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={handlePrevButtonClick}
            aria-disabled={prevBtnDisabled || currentSlideIndex <= 1}
            strokeWidth={1.5}
          />
          <ArrowRight
            className="cursor-pointer"
            onClick={handleNextButtonClick}
            aria-disabled={nextBtnDisabled}
            strokeWidth={1.5}
          />
        </div>
      </div>
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="touch-action-pan-y pinch-zoom flex w-full">
          <div
            className={`translate3d(0,0,0) w-full min-w-0 flex-[0_0_90%] transform pl-4 md:flex-[0_0_80%] xl:flex-[0_0_70%] 2xl:flex-[0_0_60%]`}
          />
          {slides.map((item, index) => (
            <div
              className={`translate3d(0,0,0) w-full min-w-0 flex-[0_0_90%] transform pl-4 md:flex-[0_0_80%] xl:flex-[0_0_70%] 2xl:flex-[0_0_60%]`}
              key={index}
            >
              <div className="h-(--slide-height) w-full select-none">
                <SlideContext.Provider
                  value={{
                    isActive: index === currentSlideIndex,
                    slideIndex: index,
                  }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
                    <div className="relative aspect-[1.5/1] h-full flex-1 overflow-hidden rounded-lg lg:w-1/2">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4 py-4">
                      <div className="font-heading text-xl font-bold lg:text-2xl">
                        {item.title}
                      </div>
                      <div className="pr-4">
                        {
                          (
                            item as Extract<
                              SlideType,
                              { description: ReactNode }
                            >
                          ).description
                        }
                      </div>
                      <div className="mt-8 pr-4 text-xs text-neutral-500">
                        {
                          (item as Extract<SlideType, { footNote: ReactNode }>)
                            .footNote
                        }
                      </div>
                    </div>
                  </div>
                </SlideContext.Provider>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-end">
          {/* Skip the first (fake) slide in dots */}
          {scrollSnaps.slice(1).map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index + 1)} // Adjust index to account for fake slide
              isSelected={index + 1 === selectedIndex}
              progress={index + 1 === selectedIndex ? autoplayProgress : 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
