"use client";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./dotsButtons";
import { PrevButton, NextButton, usePrevNextButtons } from "./ArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { SlideContext } from "./SlideContext";

type PropType = {
  slides: ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  // Default autoplay time is 4000ms (4 seconds)
  const autoplayTime = 8000;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      active: true,
      playOnInit: true,
      stopOnInteraction: false,
      delay: autoplayTime,
    }),
  ]);

  // Track the current slide index
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Update current slide index when slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());

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
    useDotButton(emblaApi, onNavButtonClick, autoplayTime);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <section
      className="relative w-full"
      style={
        {
          "--slide-height": "100vh",
          "--slide-spacing": "1rem",
        } as React.CSSProperties
      }
    >
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="touch-action-pan-y pinch-zoom flex w-full">
          {slides.map((item, index) => (
            <div
              className="translate3d(0,0,0) w-full min-w-0 flex-0 transform bg-slate-200"
              style={{ flex: "0 0 100%" }}
              key={index}
            >
              <div className="h-[var(--slide-height)] w-full select-none">
                <SlideContext.Provider
                  value={{
                    isActive: index === currentSlideIndex,
                    slideIndex: index,
                  }}
                >
                  {item}
                </SlideContext.Provider>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 bottom-8 left-0 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-end">
          {scrollSnaps?.length > 1 &&
            scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                isSelected={index === selectedIndex}
                progress={index === selectedIndex ? autoplayProgress : 0}
              />
            ))}
        </div>
      </div>
      {/* <div className="grid grid-cols-[auto_1fr] justify-between gap-[1.2rem] mt-[1.8rem] absolute bottom-0 left-0 w-full px-[1.6rem] pb-[1.6rem]">
        <div className="grid grid-cols-2 gap-[0.6rem] items-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div> */}
    </section>
  );
};

export default EmblaCarousel;
